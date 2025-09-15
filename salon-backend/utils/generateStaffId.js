const mongoose=require("mongoose");
const Staff=require("../models/Staff");
// Helper to generate next staffId (e.g. STF001, STF002)
async function generateStaffId() {
  // Find staff with highest staffId
  const lastStaff = await Staff.findOne({ staffId: { $exists: true } })
    .sort({ staffId: -1 })
    .exec();

  let nextIdNumber = 1;
  if (lastStaff && lastStaff.staffId) {
    // Extract number part after 'STF'
    const numberPart = lastStaff.staffId.replace("STF", "");
    nextIdNumber = parseInt(numberPart, 10) + 1;
  }
  return `STF${String(nextIdNumber).padStart(3, "0")}`;
}
module.exports=generateStaffId;