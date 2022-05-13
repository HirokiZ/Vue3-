export let activeEffect = undefined;

class ReactiveEffect {
  //属性记录effect:在实例上新增了active属性
  public parent = null;
  //effect记录依赖的属性
  public deps=[];
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
      activeEffect = this.parent;
      this.parent = null;
    }
  }
}

export function effect(fn) {
  //可以根据状态变化重新执行，所以effect可以嵌套着写
  const _effect = new ReactiveEffect(fn); //创建响应式的effect

  _effect.run(); //默认先执行一次
}

//一个effectdui应多个属性，一个属性对应多了effect
//先创建收集的对象
const targetMap = new WeakMap();
export function track(target, type, key) {
  //目标，类型（标记），收集的那个属性
  // debugger
  //模板中没有，直接返回
  if (!activeEffect) return;
  //先看一下有没有存放对象（第一次肯定是没有的）
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    //如果没有，那么我就set,后面的值呢，就是dep·sMap(既赋值，又把值作为结果放进去了)
    //现在就构建出一个对象，对应一个map的结构了
    targetMap.set(target, (depsMap = new Map()));
  }
  //有可能有了map,再去接着找，创建里面的set,往里放讴歌属性对应某个值
  //(第一次肯定没有)，如果有肯定是个set类数组
  let dep = depsMap.get(key); //key : name , age
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  //如果在effect中多次,使用了数据，比如state.name,state.name
  let shouldTrack = !dep.has(activeEffect); //去重
  if (shouldTrack) {
    //没有，就添加属性activeEffect
    dep.add(activeEffect);
    // debugger
    //记录effect被哪些属性收集过,存的是对应的set
    activeEffect.deps.push(dep)
  }
}

//触发更新
export function trigger(target,type,key,value,oldValue){
  // debugger
  //去找一下对象
  const depsMap = targetMap.get(target)  //找的就是 Map{ name : set }
  if(!depsMap) return;
  const effects = depsMap.get(key)       //找到属性对的effect,是一个集合里面有很多effect
  effects && effects.forEach(effect => { //如果没有，空set也可以走forEach
    if(effect !== activeEffect) effect.run()                         //重新走 ReactiveEffect 里面的逻辑
  });
}
