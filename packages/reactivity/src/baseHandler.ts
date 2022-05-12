import {activeEffect} from './effect'
//核心处理逻辑
//标记
export const enum ReactiveFlags{
    IS_REACTIVE='__V_isReactive'
}
export const mutableHandlers={
    get(target,key,receiver){ 
        if(key===ReactiveFlags.IS_REACTIVE){
            return true
        }
        //当我从代理上取值触发，我就返回target[key]
        //return target[key] -----错的
        
        activeEffect
        return Reflect.get(target,key,receiver)     
    },
    set(target,key,value,receiver){
        //代理上设置值 触发 
        return Reflect.set(target,key,value,receiver) 
    }
}
