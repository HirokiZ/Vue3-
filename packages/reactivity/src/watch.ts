//这个文件不用该出现在响应式的文件目录里

import { isFunction, isObject } from "@vue/shared";
import { ReactiveEffect } from "./effect";
import { isReactive } from "./reactive";

function traversal(value, set = new Set()) {
  if (!isObject(value)) return value;
  if (set.has(value)) {
    //如果对象里有，那么就遍历过了，直接返回值
    return value;
  }
  //否则，就添加
  set.add(value);
  for (let key in value) {
    traversal(value[key]);
  }

  return value;
}

//source 使用户传入的对象，cb是对应用户的回调
export function watch(source, cb) {
  let getter;
  //看一下传入的值是不是响应式的
  if (isReactive(source)) {
    //对用户传入的数据进行递归循环，就会访问对象上的每一个属性
    //访问属性的时候就会手机effect
    getter = () => traversal(source);
  } else if (isFunction(source)) {
    getter = source;
  } else {
    return;
  }
  let cleanup;
  const onCleanup = (fn) =>{
    cleanup=fn
  }

  let oldValue;
  const job = () => {
    //下一次watch开始触发上一次watch的清理
    if(cleanup)cleanup() 
    const newValue = effect.run();
    cb(newValue, oldValue,onCleanup);
    oldValue = newValue;
  };
  //在effect中访问属性就可以依赖收集
  const effect = new ReactiveEffect(getter, job);
  oldValue = effect.run();
}
