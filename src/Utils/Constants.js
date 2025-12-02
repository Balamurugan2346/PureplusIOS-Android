// MySingleton.js
class Constant {
  constructor() {
    if (!Constant.instance) {
      this.value = 0; // whatever you want to store
      Constant.instance = this;
    }
    return Constant.instance;
  }

  setValue(v) {
    this.value = v;
  }

  getValue() {
    return this.value;
  }
}

const instance = new Constant();
Object.freeze(instance);

export default instance;
