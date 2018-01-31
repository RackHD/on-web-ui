/**
 * A class for adding customized svg icons.
 * supported by "ClarityIcons", the added icons can be used as native @clr/icons.
 */
import { Injectable } from '@angular/core';
import { ClarityIcons } from '@clr/icons';
import { EssentialShapes } from "@clr/icons/shapes/essential-shapes";
import { SocialShapes } from "@clr/icons/shapes/social-shapes";
import { TechnologyShapes } from "@clr/icons/shapes/technology-shapes";

/**
 * ClarityIcons, for add new customized icons.
 * Usually it won't be injected by any component.
 */
@Injectable()
export class IconService {
    constructor(){}

    // example icons
    // this will be replaced by extracting icon svgs from "dellclarity"
    icons : any = {
      // shape-name: svg-code
      "superMan": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 36 36'><title>MAC set</title><g id='4b9f38fa-04ed-48a0-962b-52d52d99cb31' data-name='Layer 3'><path d='M14.3,22.6a1,1,0,0,1,.61-1.87,1,1,0,0,1,.65.2,5.47,5.47,0,0,0,3.53,1.3c1.37,0,2.23-.65,2.23-1.58v0c0-.9-.5-1.39-2.84-1.93-2.68-.65-4.2-1.44-4.2-3.76v0c0-2.16,1.8-3.65,4.3-3.65a6.94,6.94,0,0,1,4,1.17,1,1,0,0,1,.49.88,1,1,0,0,1-1,1,1.07,1.07,0,0,1-.58-.16,5.24,5.24,0,0,0-2.9-1c-1.3,0-2.05.67-2.05,1.49v0c0,1,.58,1.4,3,2,2.67.65,4,1.6,4,3.69v0c0,2.36-1.85,3.76-4.5,3.76A7.85,7.85,0,0,1,14.3,22.6Z'/><path d='M26.07,32H9.93L1.87,18,9.93,4H26.07l8.06,14Zm-15-2H24.91l6.91-12L24.91,6H11.09L4.18,18Z'/></g></svg>",
      "dell-emc-white": '<svg width=\"235px\" height=\"42px\" viewBox=\"0 0 235 42\" version=\"1.1\"  xmlns=\"http://www.w3.org/2000/svg\"  xmlns:xlink=\"http://www.w3.org/1999/xlink\"> \n <title>logo/dell emc/white</title> \n <desc>Created with Sketch.</desc> \n <defs> \n <polygon id=\"path-1\" points=\"103.644 38.0583 103.644 0.7693 0.0641 0.7693 0.0641 38.0583 103.644 38.0583\"></polygon> \n </defs> \n <g id=\"Symbols\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"> \n <g id=\"logo/dell-emc/white\"> \n <g id=\"Group-3\" transform=\"translate(131.000000, 1.172000)\"> \n <mask id=\"mask-2\" fill=\"white\"> \n <use xlink:href=\"#path-1\"></use> \n </mask> \n <g id=\"Clip-2\"></g> \n <path d=\"M23.3711,37.0213 L23.3711,35.4693 L22.8501,34.9493 L3.6901,34.9493 L3.1721,34.4333 L3.1721,20.9683 L3.6901,20.4493 L21.8171,20.4493 L22.3341,19.9313 L22.3341,18.3773 L21.8171,17.8593 L3.6901,17.8593 L3.1721,17.3403 L3.1721,4.3923 L3.6901,3.8763 L22.8501,3.8763 L23.3711,3.3593 L23.3711,1.8043 L22.8501,1.2873 L0.5831,1.2873 L0.0641,1.8043 L0.0641,37.0213 L0.5831,37.5413 L22.8501,37.5413 L23.3711,37.0213 Z M66.8721,37.0213 L66.8721,1.8043 L66.3571,1.2873 L62.7311,1.2873 L62.2131,1.8043 L48.7471,33.3963 L48.2281,33.3963 L34.7641,1.8043 L34.2451,1.2873 L30.6211,1.2873 L30.1001,1.8043 L30.1001,37.0213 L30.6211,37.5413 L32.6911,37.5413 L33.2101,37.0213 L33.2101,6.9853 L33.7281,6.9853 L46.6751,37.0213 L47.1951,37.5413 L49.7831,37.5413 L50.3001,37.0213 L63.2481,6.9853 L63.7651,6.9853 L63.7651,37.0213 L64.2851,37.5413 L66.3571,37.5413 L66.8721,37.0213 Z M89.6611,38.0583 C96.9141,38.0583 102.6091,34.4333 103.6441,26.6653 L103.1281,26.1453 L101.0561,26.1453 L100.5371,26.6653 C99.5031,32.3593 95.8771,35.4693 89.6611,35.4693 C81.8931,35.4693 76.1961,29.7703 76.1961,19.4123 C76.1961,9.0553 81.8931,3.3593 89.6611,3.3593 C95.8771,3.3593 99.5031,6.4643 100.5371,11.6433 L101.0561,12.1633 L103.1281,12.1633 L103.6441,11.6433 C102.6091,4.3923 96.9141,0.7693 89.6611,0.7693 C80.8571,0.7693 73.0881,6.9853 73.0881,19.4123 C73.0881,31.8423 80.8571,38.0583 89.6611,38.0583 L89.6611,38.0583 Z\" id=\"Fill-1\" fill=\"#FFFFFF\" mask=\"url(#mask-2)\"></path> \n </g> \// NOTE: <path d=\"M8.2344,31.508 L8.2344,9.664 L14.6964,9.664 C20.1594,9.664 24.5884,14.553 24.5884,20.586 C24.5884,26.619 20.1594,31.508 14.6964,31.508 L8.2344,31.508 Z M14.6964,38.713 C23.1324,38.713 30.2214,32.951 32.2444,25.147 L52.7554,41.172 L73.2524,25.157 L73.2524,38.713 L96.6394,38.713 L96.6394,31.508 L81.4864,31.508 L81.4864,2.459 L73.2524,2.459 L73.2524,16.015 L53.5894,31.375 L49.1924,27.94 L58.6054,20.586 L68.8544,12.578 L63.0034,8.008 L43.3404,23.369 L38.9434,19.932 L58.6054,4.571 L52.7554,0 L32.2444,16.025 C30.2214,8.221 23.1324,2.459 14.6964,2.459 L0.0004,2.459 L0.0004,38.713 L14.6964,38.713 Z M99.4414,2.459 L107.6754,2.459 L99.4414,2.459 Z M122.8304,31.508 L122.8304,38.713 L99.4414,38.713 L99.4414,2.459 L107.6754,2.459 L107.6754,31.508 L122.8304,31.508 Z\" id=\"Fill-4\" fill=\"#FFFFFF\"></path> \n </g> \n </g> \n </svg> \n '
    };

    // this function must be ran once in root component or root component for init clarity-icons
    public load(){
          ClarityIcons.add(EssentialShapes);
          ClarityIcons.add(SocialShapes);
          ClarityIcons.add(TechnologyShapes);
          ClarityIcons.add(this.icons);
    }
}
