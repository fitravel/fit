import{c,d as l,a as u,b as f,e as d,r as o,u as m}from"./vendor.b963c077.js";const p=function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const n of t.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function i(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function s(e){if(e.ep)return;e.ep=!0;const t=i(e);fetch(e.href,t)}};p();function y(a){const r=c(l({template:`
			<div class="min-h-screen min-w-screen">
				<router-view/>
			</div>`})),i=u({routes:a.routes,history:f()}),s=d();r.use(s),r.use(i),r.mount("#app")}o([]);const g=()=>({id:0,name:"",email:"",roles:{isSales:!1,isMarketing:!1,isAdmin:!1},isActive:!1}),h=()=>({token:"",lock:"",isConfirmed:!1,isActive:!1});o(g());o(h());m("JANUS","");o("");o("");o(!1);o(!1);y({lock:"pf",routes:[]});
