import React from 'react';

type Props = {
  color: string;
};

export const LogoIcon = ({ color }: Props) => (
  <svg width="136" height="33" viewBox="0 0 136 33" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0)">
      <path
        d="M45.5255 0.369629C44.4038 0.736894 43.266 1.08819 42.1123 1.40755C30.5426 4.48939 18.8447 3.89857 8.28454 0.369629L6.2334 13.4315L10.3837 14.5493L14.2136 7.55526C15.2392 7.76284 16.2647 7.93849 17.3063 8.09817L18.4921 15.9704L22.7707 16.3377L25.3186 8.7848C26.3602 8.81674 27.4178 8.81674 28.4594 8.7848L31.0073 16.3377L35.2858 15.9704L36.4717 8.0822C37.4972 7.92252 38.5228 7.74688 39.5644 7.53929L43.3942 14.5493L47.5446 13.4475L45.5255 0.369629Z"
        fill={color}
      />
      <path
        d="M37.193 16.3697L33.3631 23.3797C32.3375 23.1721 31.312 22.9965 30.2704 22.8368L29.0846 14.9486L24.79 14.5813L22.2421 22.1342C21.1845 22.1023 20.1429 22.1023 19.1013 22.1342L16.5534 14.5813L12.2749 14.9486L11.089 22.8208C10.0475 22.9805 9.02188 23.1561 7.99632 23.3637L4.16646 16.3697L0.0161133 17.4875L2.06725 30.5334C12.6274 27.0044 24.3253 26.4136 35.895 29.5114C37.0487 29.8148 38.1865 30.1661 39.3082 30.5494L41.3593 17.4875L37.193 16.3697Z"
        fill={color}
      />
      <path
        d="M69.3543 8.51357C69.3543 8.51357 67.4954 6.08643 63.5534 6.08643C59.5954 6.08643 54.4194 8.33792 54.4194 15.4597C54.4194 22.5814 59.5954 24.8968 63.5534 24.8968C67.5115 24.8968 68.7774 22.8689 69.3543 21.8788C69.3543 26.2062 65.3642 28.314 60.3325 25.823L58.073 30.6932C64.5629 33.9667 74.1456 33.2162 74.1456 21.9108V6.53353H70.0273L69.3543 8.51357ZM64.5629 19.803C62.9605 19.803 60.5408 18.7012 60.5408 15.4597C60.5408 12.2182 62.9605 11.1164 64.5629 11.1164C66.1654 11.1164 68.5851 12.2182 68.5851 15.4597C68.5851 18.7012 66.1654 19.803 64.5629 19.803Z"
        fill={color}
      />
      <path
        d="M127.443 9.45541L126.449 6.53325H122.331V24.4494H128.052V15.4275C128.052 12.2977 130.776 10.8287 133.644 11.9305L136.016 6.83664C129.975 4.16998 127.443 9.45541 127.443 9.45541Z"
        fill={color}
      />
      <path
        d="M118.101 6.53353H113.982L113.293 8.51357C113.293 8.51357 111.434 6.08643 107.492 6.08643C103.534 6.08643 98.3584 8.72116 98.3584 15.4597C98.3584 22.1343 103.534 24.8968 107.492 24.8968C112.123 24.8968 113.293 21.8788 113.293 21.8788V24.4657H118.101V21.9108V6.53353ZM108.502 19.803C106.899 19.803 104.48 18.7012 104.48 15.4597C104.48 12.2182 106.899 11.1164 108.502 11.1164C110.104 11.1164 112.524 12.2182 112.524 15.4597C112.524 18.7012 110.104 19.803 108.502 19.803Z"
        fill={color}
      />
      <path
        d="M87.0771 5.68701C80.0424 5.68701 76.4048 10.6531 76.4048 15.2998C76.4048 19.9465 79.6738 25.4714 86.5643 25.4714C93.4549 25.4714 95.7945 20.9844 96.163 20.2659L92.3812 17.8068C91.6441 18.9884 89.8333 20.3776 87.5098 20.3776C85.6189 20.3776 83.4876 19.1481 82.7665 17.0084H96.3072C96.6918 11.9146 94.1119 5.68701 87.0771 5.68701ZM83.0389 13.1281C83.744 11.675 85.1061 10.717 86.9169 10.717C89.5609 10.717 90.4262 13.1281 90.4262 13.1281H83.0389Z"
        fill={color}
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <rect width="136" height="32" fill={color} transform="translate(0 0.369629)" />
      </clipPath>
    </defs>
  </svg>
);

export const SearchIcon = ({ color }: Props) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.71 11H12.5L17.49 16L16 17.49L11 12.5V11.71L10.73 11.43C9.59 12.41 8.11 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 8.11 12.41 9.59 11.43 10.73L11.71 11ZM2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2C4.01 2 2 4.01 2 6.5Z"
      fill={color}
    />
  </svg>
);

export const PaginationArrow = ({ color }: Props) => (
  <svg width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.839844 1.41L5.41984 6L0.839844 10.59L2.24984 12L8.24984 6L2.24984 0L0.839844 1.41Z" fill={color} />
  </svg>
);

export const CodeIcon = ({ color }: Props) => (
  <svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.8621 14.6999C6.57917 14.6999 6.29385 14.6003 6.06608 14.3975L0 8.99993L6.40295 3.30233C6.89686 2.86433 7.65452 2.90633 8.09449 3.40193C8.53447 3.89753 8.49011 4.65593 7.99499 5.09633L3.60848 8.99993L7.65812 12.6023C8.15324 13.0427 8.19759 13.8011 7.75762 14.2967C7.52145 14.5643 7.19178 14.6999 6.8621 14.6999ZM17.5856 14.6975L23.9886 8.99993L17.9225 3.60233C17.4274 3.16193 16.6697 3.20633 16.2309 3.70193C15.791 4.19753 15.8353 4.95593 16.3305 5.39633L20.3801 8.99993L15.9936 12.9023C15.4985 13.3427 15.4541 14.1011 15.8941 14.5967C16.1302 14.8643 16.4599 14.9999 16.7896 14.9999C17.0725 14.9999 17.3578 14.9003 17.5856 14.6975ZM11.9775 16.3979L14.3752 1.99793C14.4843 1.34393 14.0431 0.725934 13.3897 0.616734C12.734 0.506334 12.1178 0.949134 12.0111 1.60313L9.61341 16.0031C9.50432 16.6571 9.94549 17.2751 10.5989 17.3843C10.666 17.3951 10.7307 17.3999 10.7967 17.3999C11.3721 17.3999 11.8804 16.9835 11.9775 16.3979Z"
      fill={color}
    />
  </svg>
);

export const NotificationIcon = ({ color }: Props) => (
  <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 20C9.1 20 10 19.1 10 18H6C6 19.1 6.89 20 8 20ZM14 14V9C14 5.93 12.36 3.36 9.5 2.68V2C9.5 1.17 8.83 0.5 8 0.5C7.17 0.5 6.5 1.17 6.5 2V2.68C3.63 3.36 2 5.92 2 9V14L0 16V17H16V16L14 14Z"
      fill={color}
    />
  </svg>
);

export const CloseIcon = ({ color }: Props) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M13.6982 13.6982C14.1006 13.2957 14.1006 12.6433 13.6982 12.2408L8.45734 7.00003L13.6982 1.84751C14.1006 1.44508 14.1006 0.792612 13.6982 0.39018C13.2957 -0.0122527 12.6433 -0.0122527 12.2408 0.39018L7.00001 5.5427L1.75915 0.301824C1.35672 -0.100608 0.704253 -0.100608 0.301823 0.301824C-0.100608 0.704256 -0.100608 1.35673 0.301823 1.75916L5.54268 7.00003L0.301823 12.2408C-0.100608 12.6433 -0.100608 13.2957 0.301823 13.6982C0.704253 14.1006 1.35672 14.1006 1.75915 13.6982L7.00001 8.45737L12.2408 13.6982C12.6433 14.1006 13.2957 14.1006 13.6982 13.6982Z"
      fill={color}
    />
  </svg>
);

export const UnReadNotificationsIcon = ({ color }: Props) => (
  <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 20C9.1 20 10 19.1 10 18H6C6 19.1 6.89 20 8 20ZM14 9C14 5.93 12.36 3.36 9.5 2.68V0.5H6.5V2.68C6.26 2.74 6.03 2.83 5.81 2.91L14 11.1V9ZM1.41 1.35L0 2.76L2.81 5.57C2.29 6.57 2 7.73 2 9V14L0 16V17H14.24L15.98 18.74L17.39 17.33L1.41 1.35Z"
      fill={color}
    />
  </svg>
);

export const ReadNotificationsIcon = ({ color }: Props) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5.58027 2.08L4.15027 0.65C1.75027 2.48 0.170273 5.3 0.0302734 8.5H2.03027C2.18027 5.85 3.54027 3.53 5.58027 2.08ZM17.9703 8.5H19.9703C19.8203 5.3 18.2403 2.48 15.8503 0.65L14.4303 2.08C16.4503 3.53 17.8203 5.85 17.9703 8.5ZM16.0003 9C16.0003 5.93 14.3603 3.36 11.5003 2.68V0.5H8.50027V2.68C5.63027 3.36 4.00027 5.92 4.00027 9V14L2.00027 16V17H18.0003V16L16.0003 14V9ZM10.0003 20C10.1403 20 10.2703 19.99 10.4003 19.96C11.0503 19.82 11.5803 19.38 11.8403 18.78C11.9403 18.54 11.9903 18.28 11.9903 18H7.99027C8.00027 19.1 8.89027 20 10.0003 20Z"
      fill={color}
    />
  </svg>
);

export const DropdownArrow = () => (
  <svg width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M0 0H10L5 5L0 0Z" fill="#BDBDBD" />
  </svg>
);

export const CopyClipboard = ({ color }: Props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" fill={color} />
  </svg>
);
