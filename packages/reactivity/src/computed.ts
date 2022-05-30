import { isFunction } from "@vue/shared";
import { ReactiveEffect, trackEffects,triggerEffects } from "./effect";

class ComputedRefImpl {
  public effect;
  //一开始，是脏的
  public _dirty = true;
  public _v_isReadonly = true;
  public _v_isRef = true;
  public _value;
  public dep;
  constructor(getter, public setter) {
    //我们将用户的getter放到effect中，这里面的firstName和lastName就会被effect收集起来
    this.effect = new ReactiveEffect(getter, () => {
      //这个回调，就是数据发生改变，走这里
      if (!this._dirty) {
        //改了，不脏了
        this._dirty = true;
        //实现触发更新
        triggerEffects(this.dep)
      }
    });
    //类中的属性访问器，底层就是Object.defineProperty
    //如果用defineProperty想操作同一个属性，同一个值，那么就需要 共有属性_value
  }
  get value() { 
    trackEffects(this.dep||(this.dep=new Set()))
    //如果值是脏的，就执行run()
    if (this._dirty) {
      this._dirty = false;
      this._value = this.effect.run();
    }
    return this._value;
  }
  set value(newValue) {
    this.setter(newValue);
  }
}

export const computed = (getterOrOptions) => {
  let onlyGutter = isFunction(getterOrOptions);
  let getter;
  let setter;
  if (onlyGutter) {
    getter = getterOrOptions;
    setter = () => {
      console.warn("no set");
    };
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  //返回实例
  return new ComputedRefImpl(getter, setter);
};
