export class Parameter {
  /**
   * @param {string} key name of the param
   * @param value value of the parameter
   */
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }

  toString() {
    let value = "";

    if (this.value !== undefined && this.value !== null && this.value !== "")
      value = `${this.key}=${this.value}`;

    return value;
  }
}
