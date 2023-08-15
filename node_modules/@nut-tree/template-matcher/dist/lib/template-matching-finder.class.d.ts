import { Image, ImageFinderInterface, MatchRequest, MatchResult } from "@nut-tree/nut-js";
export default class TemplateMatchingFinder implements ImageFinderInterface {
    private scaleSteps;
    constructor();
    findMatches<PROVIDER_DATA_TYPE>(matchRequest: MatchRequest<Image, PROVIDER_DATA_TYPE>): Promise<MatchResult[]>;
    findMatch<PROVIDER_DATA_TYPE>(matchRequest: MatchRequest<Image, PROVIDER_DATA_TYPE>): Promise<MatchResult>;
    private searchMultipleScales;
}
//# sourceMappingURL=template-matching-finder.class.d.ts.map