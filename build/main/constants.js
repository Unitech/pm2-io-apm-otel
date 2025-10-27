"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canUseInspector = canUseInspector;
const semver = require("semver");
exports.default = {
    METRIC_INTERVAL: 990
};
function canUseInspector() {
    const isAboveNode10 = semver.satisfies(process.version, '>= 10.1.0');
    const isAboveNode8 = semver.satisfies(process.version, '>= 8.0.0');
    const canUseInNode8 = process.env.FORCE_INSPECTOR === '1'
        || process.env.FORCE_INSPECTOR === 'true' || process.env.NODE_ENV === 'production';
    return isAboveNode10 || (isAboveNode8 && canUseInNode8);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbnN0YW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQU1BLDBDQU1DO0FBWkQsaUNBQWdDO0FBRWhDLGtCQUFlO0lBQ2IsZUFBZSxFQUFFLEdBQUc7Q0FDckIsQ0FBQTtBQUVELFNBQWdCLGVBQWU7SUFDN0IsTUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFBO0lBQ3BFLE1BQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQTtJQUNsRSxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsS0FBSyxHQUFHO1dBQ3BELE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxLQUFLLE1BQU0sSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsS0FBSyxZQUFZLENBQUE7SUFDcEYsT0FBTyxhQUFhLElBQUksQ0FBQyxZQUFZLElBQUksYUFBYSxDQUFDLENBQUE7QUFDekQsQ0FBQyJ9