import { test } from 'node:test';
import assert from 'node:assert/strict';
import { initialData,createHackathon,addTask,addNews,setTaskCompleted,preparationProgress,isSnapshot } from '../src/model.js';

const base=()=>createHackathon(initialData('ru'),{name:'Demo',deadline:'2026-10-26'}).data;
test('tasks accept an optional assignee and reject blank titles without changing saved data',()=>{
  const data=base();
  assert.equal(addTask(data,{title:'   '},'a').ok,false);
  const first=addTask(data,{title:'  Record demo  '},'a').data;
  assert.deepEqual(first.tasks[0],{id:'a',title:'Record demo',assignee:'',completed:false});
  assert.equal(data.tasks.length,0);
  assert.equal(addTask(first,{title:'Ship',assignee:' Alex '},'b').data.tasks[1].assignee,'Alex');
  assert.equal(isSnapshot(first),true);
});
test('progress follows actual tasks in both directions, including empty and near-complete lists',()=>{
  let data=addTask(base(),{title:'One'},'a').data;
  data=addTask(data,{title:'Two'},'b').data;
  const before=data;
  assert.equal(preparationProgress(data.tasks).percent,0);
  data=setTaskCompleted(data,'a',true);
  assert.deepEqual(preparationProgress(data.tasks),{done:1,total:2,percent:50});
  assert.equal(before.tasks[0].completed,false);
  data=setTaskCompleted(data,'b',true); assert.equal(preparationProgress(data.tasks).percent,100);
  data=setTaskCompleted(data,'a',false); assert.equal(preparationProgress(data.tasks).percent,50);
  assert.equal(preparationProgress([]).percent,0);
  assert.equal(preparationProgress(Array.from({length:1000},(_,i)=>({completed:i<999}))).percent,99);
});
test('news require a title and http/https source and retain user text as text',()=>{
  const data=base();
  assert.deepEqual(addNews(data,{title:'',url:'javascript:alert(1)'},'n').errors,{title:'newsTitleRequired',url:'urlInvalid'});
  const result=addNews(data,{title:' <b>Demo</b> ',url:'https://example.com/news'},'n');
  assert.equal(result.data.news[0].title,'<b>Demo</b>');
  assert.equal(result.data.news[0].url,'https://example.com/news');
  assert.equal(data.news.length,0); assert.equal(isSnapshot(result.data),true);
});
