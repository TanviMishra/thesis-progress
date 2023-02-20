export function applyStyle(el, property, value, unit) {
  unit ? (el.style[property] = value + unit) : (el.style[property] = value);
}
export function applyStyleObj(el, styleObjArr) {
  //styleObjArr takes an object array in the same order property,value and unit
  if (styleObjArr && styleObjArr.length > 0) {
    styleObjArr.forEach((styleObj) => {
      let property = styleObj.property;
      let value = styleObj.value;
      let unit = styleObj.unit ? styleObj.unit : null;
      unit ? (el.style[property] = value + unit) : (el.style[property] = value);
    });
  }
}
export function appendElement(
  parent_element,
  element_type,
  classList,
  ID,
  attributeArr
) {
  let append = document.createElement(element_type); //create document element for element type
  let returnMe = parent_element.appendChild(append); //create a variable to append element and store it
  if (classList && classList.length > 0) {
    classList.forEach((el_class) => {
      returnMe.classList.add(el_class);
    }); //apply classnames to element
  }
  if (attributeArr && attributeArr.length > 0) {
    attributeArr.forEach((attr) => {
      returnMe.setAttribute(attr.type, attr.value); //apply id variable
    }); //apply classnames to element
  }
  if (ID) {
    returnMe.setAttribute("id", ID);
  }
  return returnMe;
}
