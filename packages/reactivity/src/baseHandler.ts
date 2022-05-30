import { isObject } from '@vue/shared'
import {track,trigger} from './effect'
import { reactive } from './reactive'
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
        // debugger
        //当我从代理上取值触发，我就返回target[key]
        //return target[key] -----错的
        track(target,'get',key)

        //如果返回的是对象套对象的数据
        let res=Reflect.get(target,key,receiver) 
        //如果是一个对象，将再次代理
        if(isObject(res)){
            //深度代理实现
            return reactive(res)
        } 
        return res
    },
    set(target,key,value,receiver){
        //代理上设置值 触发 
        //老值
        let oldValue = target[key]
        //新值
        let result=Reflect.set(target,key,value,receiver) 
        //对比
        if(oldValue !== value){//值变化了
            //更新
            trigger(target,"set",key,value,oldValue)
        }
        return  result
    }
}
