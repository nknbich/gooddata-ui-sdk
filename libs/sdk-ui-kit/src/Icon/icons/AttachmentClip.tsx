// (C) 2022 GoodData Corporation
import React from "react";
import { IIconProps } from "../typings";

/**
 * @internal
 */
export const AttachmentClip: React.FC<IIconProps> = ({ className, width = 12, height = 12, color }) => {
    return (
        <svg
            className={className}
            width={width}
            height={height}
            viewBox="0 0 9 19"
            fill={color ?? "#94A1AD"}
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
        >
            <path d="M4.55176 18.8965C3.99512 18.8965 3.4707 18.791 2.97852 18.5801C2.48633 18.3691 2.05566 18.082 1.68652 17.7188C1.32324 17.3496 1.0332 16.9189 0.816406 16.4268C0.605469 15.9346 0.5 15.4102 0.5 14.8535V4.05176C0.5 3.61816 0.582031 3.21094 0.746094 2.83008C0.910156 2.44336 1.13574 2.10938 1.42285 1.82812C1.70996 1.54102 2.04395 1.31543 2.4248 1.15137C2.80566 0.981445 3.21289 0.896484 3.64648 0.896484C4.08594 0.896484 4.49609 0.981445 4.87695 1.15137C5.25781 1.31543 5.58887 1.54102 5.87012 1.82812C6.15723 2.10938 6.38281 2.44336 6.54688 2.83008C6.7168 3.21094 6.80176 3.61816 6.80176 4.05176V13.9482C6.80176 14.2588 6.74316 14.5518 6.62598 14.8271C6.50879 15.0967 6.34766 15.334 6.14258 15.5391C5.9375 15.7441 5.69727 15.9053 5.42188 16.0225C5.15234 16.1396 4.8623 16.1982 4.55176 16.1982C4.24121 16.1982 3.94824 16.1396 3.67285 16.0225C3.40332 15.9053 3.16602 15.7441 2.96094 15.5391C2.75586 15.334 2.59473 15.0967 2.47754 14.8271C2.36035 14.5518 2.30176 14.2588 2.30176 13.9482V8.55176C2.30176 8.42871 2.3457 8.32324 2.43359 8.23535C2.52148 8.14746 2.62695 8.10352 2.75 8.10352C2.87305 8.10352 2.97852 8.14746 3.06641 8.23535C3.1543 8.32324 3.19824 8.42871 3.19824 8.55176V13.9482C3.19824 14.3232 3.33008 14.6426 3.59375 14.9062C3.85742 15.1699 4.17676 15.3018 4.55176 15.3018C4.9209 15.3018 5.2373 15.1699 5.50098 14.9062C5.76465 14.6426 5.89648 14.3232 5.89648 13.9482V4.05176C5.89648 3.74121 5.83789 3.45117 5.7207 3.18164C5.60352 2.90625 5.44238 2.66602 5.2373 2.46094C5.03809 2.25586 4.80078 2.09473 4.52539 1.97754C4.25 1.86035 3.95703 1.80176 3.64648 1.80176C3.33594 1.80176 3.04297 1.86035 2.76758 1.97754C2.49805 2.09473 2.26074 2.25586 2.05566 2.46094C1.85645 2.66602 1.69531 2.90625 1.57227 3.18164C1.45508 3.45117 1.39648 3.74121 1.39648 4.05176V14.8535C1.39648 15.2871 1.47852 15.6943 1.64258 16.0752C1.8125 16.4561 2.03809 16.79 2.31934 17.0771C2.60645 17.3643 2.94043 17.5898 3.32129 17.7539C3.70801 17.918 4.11816 18 4.55176 18C4.98535 18 5.39258 17.918 5.77344 17.7539C6.1543 17.5898 6.48828 17.3643 6.77539 17.0771C7.0625 16.79 7.28809 16.4561 7.45215 16.0752C7.61621 15.6943 7.69824 15.2871 7.69824 14.8535V8.55176C7.69824 8.42871 7.74219 8.32324 7.83008 8.23535C7.91797 8.14746 8.02344 8.10352 8.14648 8.10352C8.27539 8.10352 8.38379 8.14746 8.47168 8.23535C8.55957 8.32324 8.60352 8.42871 8.60352 8.55176V14.8535C8.60352 15.4102 8.49512 15.9346 8.27832 16.4268C8.06738 16.9189 7.77734 17.3496 7.4082 17.7188C7.04492 18.082 6.61719 18.3691 6.125 18.5801C5.63281 18.791 5.1084 18.8965 4.55176 18.8965Z" />
        </svg>
    );
};