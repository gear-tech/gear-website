import { PortableRegistry, TypeRegistry } from '@polkadot/types';
import { Si1LookupTypeId } from '@polkadot/types/interfaces';
import { Codec, Registry } from '@polkadot/types/types';
import { HexString } from '@polkadot/util/types';
import { hexToU8a } from '@polkadot/util';
import assert from 'assert';

interface TypeStructure {
  name: string;
  kind: 'primitive' | 'empty' | 'none' | 'sequence' | 'composite' | 'variant' | 'array' | 'tuple';
  type: string | object | TypeStructure;
  len?: number;
}

export class Metadata {
  private registry: Registry;
  private portableRegistry: PortableRegistry;
  private types: Map<number, { name: string; def: any }>;

  constructor(hexRegistry: HexString) {
    this.registry = new TypeRegistry();
    this.portableRegistry = new PortableRegistry(this.registry, hexToU8a(hexRegistry), true);
    this.types = new Map();
    this.prepare();
    this.registerTypes();
  }

  private prepare() {
    for (const type of this.portableRegistry.types) {
      const name = this.portableRegistry.getName(type.id);
      const typeDef = this.portableRegistry.getTypeDef(type.id);
      if (name !== undefined) {
        this.types.set(type.id.toNumber(), { name: this.portableRegistry.getName(type.id), def: typeDef.type });
      } else {
        assert(
          typeDef.lookupIndex === type.id.toNumber(),
          'Lookup index of type is not equal to index in portable registry',
        );
        this.types.set(typeDef.lookupIndex, { name: typeDef.type, def: null });
      }
    }
  }

  private registerTypes() {
    const types = {};
    Array.from(this.types.values()).forEach(({ name, def }) => {
      if (def) {
        types[name] = def;
      }
    });
    this.registry.setKnownTypes({ types });
    this.registry.register(types);
  }

  createType(typeIndex: number, payload: unknown): Codec {
    const type = this.types.get(typeIndex);
    assert.notStrictEqual(type, undefined, `Type with index ${typeIndex} not found in registered types`);
    return this.registry.createType(type.name, payload);
  }

  getTypeDef(typeIndex: number | Si1LookupTypeId): string | Record<string, any>;

  getTypeDef(typeIndex: number | Si1LookupTypeId, additionalFields: false): string | Record<string, any>;

  getTypeDef(typeIndex: number | Si1LookupTypeId, additionalFields: true): TypeStructure;

  getTypeDef(
    typeIndex: number | Si1LookupTypeId,
    additionalFields?: boolean,
  ): string | Record<string, any> | TypeStructure;

  getTypeDef(
    typeIndex: number | Si1LookupTypeId,
    additionalFields = false,
  ): string | Record<string, any> | TypeStructure {
    const { def } = this.portableRegistry.getSiType(typeIndex);

    if (def.isPrimitive) {
      return additionalFields
        ? { name: def.asPrimitive.type, kind: 'primitive', type: def.asPrimitive.type }
        : def.asPrimitive.type;
    }

    if (def.isEmpty) {
      return additionalFields ? { name: '()', kind: 'empty', type: null } : null;
    }

    if (def.isNone) {
      return additionalFields ? { name: 'None', kind: 'none', type: null } : null;
    }

    if (def.isSequence) {
      return additionalFields
        ? {
            name: this.getTypeName(typeIndex),
            kind: 'sequence',
            type: this.getTypeDef(def.asSequence.type, additionalFields),
          }
        : [this.getTypeDef(def.asSequence.type, additionalFields)];
    }

    if (def.isTuple) {
      const tuple = def.asTuple.map((index) => this.getTypeDef(index, additionalFields));
      return additionalFields ? { name: this.getTypeName(typeIndex), kind: 'tuple', type: tuple } : tuple;
    }

    if (def.isArray) {
      const arrayType = this.getTypeDef(def.asArray.type, additionalFields);
      const len = def.asArray.len.toNumber();
      return additionalFields
        ? { name: this.getTypeName(typeIndex), kind: 'array', type: arrayType, len }
        : [arrayType, len];
    }

    if (def.isComposite) {
      let result: any = {};
      for (const { name, type } of def.asComposite.fields) {
        if (name.isSome) {
          result[name.unwrap().toString()] = this.getTypeDef(type, additionalFields);
          continue;
        }
        if (def.asComposite.fields.length === 1) {
          result = this.getTypeDef(type, additionalFields);
          return additionalFields ? { ...result, name: this.getTypeName(typeIndex) } : result;
        }
      }
      return additionalFields ? { name: this.getTypeName(typeIndex), kind: 'composite', type: result } : result;
    }

    if (def.isVariant) {
      const _variants = {};
      for (const { name, fields } of def.asVariant.variants) {
        if (fields.length === 0) {
          _variants[name.toString()] = null;
          continue;
        }

        if (fields.length === 1) {
          _variants[name.toString()] = this.getTypeDef(fields[0].type, additionalFields);
          continue;
        }

        const fields_ = {};
        fields.map(({ name, type }) => {
          fields_[name.toString()] = type ? this.getTypeDef(type, additionalFields) : null;
        });

        _variants[name.toString()] = fields_;
      }
      return additionalFields
        ? {
            name: this.getTypeName(typeIndex),
            kind: 'variant',
            type: _variants,
          }
        : { _variants };
    }
  }

  private getTypeName(index: number | Si1LookupTypeId) {
    const { def, params, path } = this.portableRegistry.getSiType(index);

    if (def.isPrimitive) {
      return def.asPrimitive.toString();
    }

    if (def.isEmpty) {
      return '()';
    }

    if (def.isNone) {
      return 'None';
    }

    if (def.isSequence) {
      return `Vec<${this.getTypeName(def.asSequence.type)}>`;
    }

    if (def.isTuple) {
      return `(${def.asTuple.map((index) => this.getTypeName(index)).join(', ')})`;
    }

    if (def.isArray) {
      return `[${this.getTypeName(def.asArray.type)};${def.asArray.len.toNumber()}]`;
    }

    if (def.isComposite) {
      if (params.length > 0) {
        return `${path.at(-1)}<${params
          .map(({ type, name }) => (type.isSome ? this.getTypeName(type.unwrap()) : name.toString()))
          .join(', ')}>`;
      }
      return path.at(-1).toString();
    }

    if (def.isVariant) {
      if (params.length > 0) {
        return `${path.at(-1)}<${params
          .map(({ type, name }) => (type.isSome ? this.getTypeName(type.unwrap()) : name.toString()))
          .join(', ')}>`;
      }
      return this.portableRegistry.getName(index);
    }
  }
}
