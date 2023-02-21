import * as helpers from "../../helpers.js";
export class landUnits {
  constructor(continent, landType = "other", biostock = 0) {
    this.continent = continent;
    this.landType = landType;
    this.biostock = biostock;
    // this.coordinates = coordinates;
    // if (this.landType == "Naturally_regenerating_forest") {
    //   this.biostock = helpers.randomNumber(1, 12);
    // }
    // if (this.landType == "Planted_Forest") {
    //   this.biostock = helpers.randomNumber(1, 6);
    // }
    // if (this.landType == "Other_land") {
    //   this.biostock = helpers.randomNumber(1, 6);
    // }
    // this.carbonEmited = this.carbonEmitCalc(this.landType);
  }
  renameLandTypes(type) {
    switch (type) {
      case "Naturally_regenerating_forest":
        return "Primary forest";
        break;
      case "Planted_Forest":
        return "Baby forest";
        break;
      case "Meadows":
        return "Meadows";
        break;
      case "Cropland":
        return "Farms";
        break;
      case "Other_land":
        return "Barren land";
        break;
      case "Urban_land":
        return "Cities";
        break;
      default:
        break;
    }
  }
  carbonEmitCalc(type) {
    switch (type) {
      case "Naturally_regenerating_forest":
        return this.biostock;
        break;
      case "Planted_Forest":
        return this.biostock;
        break;
      case "Meadows":
        return 20;
        break;
      case "Cropland":
        return 10;
        break;
      case "Other_land":
        return this.biostock;
        break;
      case "Urban_land":
        return 20;
        break;
      case "Water":
        return 0;
        break;
      default:
        break;
    }
  }
  hoverInfo(domElement) {
    domElement.innerHTML =
      "Continent: " +
      this.continent +
      "Land type: " +
      this.renameLandTypes(this.landType) +
      "<br>" +
      "Carbon emitted: " +
      this.carbonEmited +
      "<br>";
    // if (this.biostock != 0) {
    //   domElement.innerHTML += "Carbon stock: " + this.biostock;
    // }
    domElement.style.top = event.clientY + 10 + "px";
    domElement.style.left = event.clientX + 10 + "px";
  }
  carbonVal() {
    return this.carbonEmited;
  }
}
