import React from 'react'
import InlineSVG from 'svg-inline-react';

import { COLORS } from '../../styles/variables'

export default () => {
    const allColors = Object.values(COLORS.allParcel).join(';');
    return (
        <InlineSVG
            element="div"
            src={`
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M7 2v11h3v9l7-12h-4l4-8z">
                        <animate
                            attributeType="XML"
                            attributeName="fill"
                            values="${allColors}"
                            dur="0.8s"
                            repeatCount="indefinite"
                        />
                    </path>
                </svg>
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                    viewBox="0 0 392.697 392.697" xml:space="preserve">
                    <g>
                        <path d="M21.837,83.419l36.496,16.678L227.72,19.886c1.229-0.592,2.002-1.846,1.98-3.209c-0.021-1.365-0.834-2.592-2.082-3.145
                            L197.766,0.3c-0.903-0.4-1.933-0.4-2.837,0L21.873,77.036c-1.259,0.559-2.073,1.803-2.081,3.18
                            C19.784,81.593,20.584,82.847,21.837,83.419z">
                            <animate
                                attributeType="XML"
                                attributeName="fill"
                                values="${allColors}"
                                dur="0.8s"
                                repeatCount="indefinite"
                            />
                        </path>
                        <path d="M185.689,177.261l-64.988-30.01v91.617c0,0.856-0.44,1.655-1.167,2.114c-0.406,0.257-0.869,0.386-1.333,0.386
                            c-0.368,0-0.736-0.082-1.079-0.244l-68.874-32.625c-0.869-0.416-1.421-1.293-1.421-2.256v-92.229L6.804,95.5
                            c-1.083-0.496-2.344-0.406-3.347,0.238c-1.002,0.645-1.608,1.754-1.608,2.944v208.744c0,1.371,0.799,2.615,2.045,3.185
                            l178.886,81.768c0.464,0.211,0.96,0.315,1.455,0.315c0.661,0,1.318-0.188,1.892-0.555c1.002-0.645,1.608-1.754,1.608-2.945
                            V180.445C187.735,179.076,186.936,177.831,185.689,177.261z">
                            <animate
                                attributeType="XML"
                                attributeName="fill"
                                values="${allColors}"
                                dur="0.8s"
                                repeatCount="indefinite"
                            />
                        </path>
                        <path d="M389.24,95.74c-1.002-0.644-2.264-0.732-3.347-0.238l-178.876,81.76c-1.246,0.57-2.045,1.814-2.045,3.185v208.751
                            c0,1.191,0.606,2.302,1.608,2.945c0.572,0.367,1.23,0.555,1.892,0.555c0.495,0,0.991-0.104,1.455-0.315l178.876-81.768
                            c1.246-0.568,2.045-1.813,2.045-3.185V98.685C390.849,97.494,390.242,96.384,389.24,95.74z">
                            <animate
                                attributeType="XML"
                                attributeName="fill"
                                values="${allColors}"
                                dur="0.8s"
                                repeatCount="indefinite"
                            />
                        </path>
                        <path d="M372.915,80.216c-0.009-1.377-0.823-2.621-2.082-3.18l-60.182-26.681c-0.938-0.418-2.013-0.399-2.938,0.045
                            l-173.755,82.992l60.933,29.117c0.462,0.211,0.958,0.316,1.455,0.316s0.993-0.105,1.455-0.316l173.066-79.092
                            C372.122,82.847,372.923,81.593,372.915,80.216z">
                            <animate
                                attributeType="XML"
                                attributeName="fill"
                                values="${allColors}"
                                dur="0.8s"
                                repeatCount="indefinite"
                            />
                        </path>
                    </g>
                </svg>
            `}
        />
    );
}
