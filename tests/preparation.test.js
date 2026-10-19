import { test } from 'node:test';
import assert from 'node:assert/strict';
import { initialData,createHackathon,addTask,addNews,setTaskCompleted,preparationProgress,isSnapshot,updateTask,updateNews,removeTask,removeNews } from '../src/model.js';

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

test('editing an assigned completed task keeps its identity and completion, and permits clearing the assignee',()=>{
  const data=setTaskCompleted(addTask(base(),{title:'Record',assignee:'Alex'},'t').data,'t',true);
  const result=updateTask(data,'t',{title:' Record video ',assignee:''});
  assert.deepEqual(result.data.tasks[0],{id:'t',title:'Record video',assignee:'',completed:true});
  assert.equal(data.tasks[0].title,'Record');assert.equal(data.tasks[0].assignee,'Alex');
  assert.equal(updateTask(data,'t',{title:'  '}).ok,false);
});
test('editing news retains the id and rejects invalid changes without changing the original record',()=>{
  const data=addNews(base(),{title:'Before',url:'https://example.com'},'n').data;
  const result=updateNews(data,'n',{title:'After',url:'https://example.org/updated'});
  assert.deepEqual(result.data.news[0],{id:'n',title:'After',url:'https://example.org/updated'});
  assert.equal(updateNews(data,'n',{title:'After',url:'javascript:alert(1)'}).ok,false);
  assert.equal(data.news[0].title,'Before');
});
test('editing hackathon details retains both preparation lists',()=>{
  let data=addTask(base(),{title:'Record'},'t').data;
  data=addNews(data,{title:'Source',url:'https://example.com'},'n').data;
  const edited=createHackathon(data,{name:'New name',deadline:'2027-01-01'}).data;
  assert.deepEqual(edited.tasks,data.tasks);assert.deepEqual(edited.news,data.news);
  assert.equal(data.hackathon.name,'Demo');assert.equal(isSnapshot(edited),true);
});
test('deleting a task recalculates progress, emptying the list resets to zero, and news deletion is independent',()=>{
  let data=addTask(base(),{title:'One'},'a').data;
  data=addTask(data,{title:'Two'},'b').data;data=setTaskCompleted(data,'a',true);
  const one=removeTask(data,'b');assert.equal(preparationProgress(one.tasks).percent,100);
  assert.equal(data.tasks.length,2);
  const empty=removeTask(one,'a');assert.equal(preparationProgress(empty.tasks).percent,0);
  const withNews=addNews(one,{title:'Source',url:'https://example.com'},'n').data;
  const withoutNews=removeNews(withNews,'n');assert.equal(withoutNews.news.length,0);assert.deepEqual(withoutNews.tasks,one.tasks);
});
