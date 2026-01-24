export function calculateTotalMark(ca, sn, bonus, penalty) {
    return ((ca * 40) / 100 + (bonus - penalty)) + (sn * 60) / 100
}