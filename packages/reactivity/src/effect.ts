export let activeEffect = undefined;

class ReactiveEffect {
  //在实例上新增了active属性
  public parent = null;
  public active = true;
  constructor(public fn) {}
  run() {
    //默认执行第一次,
    //非激活状态，只要执行函数，不需要进行依赖收集
    if (!this.active) {
      return this.fn();
    }
    //要做依赖收集了，核心就是将当前的effect 和稍后渲染的属性关联在一起
    //当run的时候，在全局定义一个activeEffect
    try {
      this.parent = activeEffect;
      activeEffect = this; //把activeEffect挂到实例上
      return this.fn(); //当稍后调用取值操作的时候，就可以获取到这个全集局的activeEffect
    } finally {
      activeEffect = this.parent
      this.parent = null
    }
  }
}

export function effect(fn) {
  //可以根据状态变化重新执行，所以effect可以嵌套着写
  const _effect = new ReactiveEffect(fn); //创建响应式的effect

  _effect.run(); //默认先执行一次
}

const targetMap = new WeakMap() 
export function track(target,type,key){  //目标，类型（标记），收集的那个属性
    //
    if(!activeEffect) return
// 对象某个属性 -> 多个effect
// weakMap = { 对象 ：Map{ name:set} }
// {对象：{name:[]}}
//26分
}
