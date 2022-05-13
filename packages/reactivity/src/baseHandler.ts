import {track,trigger} from './effect'
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
        return Reflect.get(target,key,receiver)     
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
