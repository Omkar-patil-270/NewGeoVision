import * as Cesium from "cesium";

// Cesium Ion Token from GeoVision project
export const CESIUM_ION_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5MGEwNWUxMi1mNDAzLTRlNzAtOWQ3OS1kNGU3M2FmMTA1YzMiLCJpZCI6NDQ5OTEyLCJpc3MiOiJodHRwczovL2FwaS5jZXNpdW0uY29tIiwiYXVkIjoidW5kZWZpbmVkX2RlZmF1bHQiLCJpYXQiOjE3ODI2MjQyMTN9.QTBq75JiikYp9vfFJOc1AaclF2uJ5UITluP2rU5v6qw";

if (Cesium && Cesium.Ion) {
  Cesium.Ion.defaultAccessToken = CESIUM_ION_TOKEN;
}

export default Cesium;
