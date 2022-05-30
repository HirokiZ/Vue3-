import { isObject } from "@vue/shared"
import { mutableHandlers,ReactiveFlags } from './baseHandler'
//WeakMap()不会导致内存泄漏，弱引用，和map
const reactiveMap=new WeakMap();

//watch判断响应式数据的方法
export function isReactive(value){
    return !!(value && value[ReactiveFlags.IS_REACTIVE]) //取反
}

//讲数据转换成响应式数据，reactive只能做对象代理,和map很像，key只能是对象
export function reactive(target){
    if(!isObject(target)){
        return
    }
    if(target[ReactiveFlags.IS_REACTIVE]){
        return target
    }
    let exisitingProxy=reactiveMap.get(target)
    if(exisitingProxy){
        return exisitingProxy
    }
    const proxy=new Proxy(target,mutableHandlers);
    reactiveMap.set(target,proxy)
    return proxy
}

//页面中使用了alias对应的值，稍后name变化了，肯定都要从新渲染


