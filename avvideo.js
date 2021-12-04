// ==UserScript==
// @name         AV Video
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include        /^https:\/\/tktube.com\//
// @include        /^https:\/\/jable.tv\//
// @icon         https://www.google.com/s2/favicons?domain=tktube.com
// @grant        GM_addElement
// @grant        GM_log
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';
    const fn_tktube=function(){
        GM_log("Match Tktube");
        const fn_blockAD=function(){
            try{
                const selector="div.exo_wrapper"
                +",div.table"
                +",div.sponsor"
                +",div.footer-margin"
                +",div.top"
                +",iframe"
                +",div.network";
                document.querySelectorAll(selector).forEach((el)=>{
                    el.remove();
                });

            }catch(e){}

            window.setTimeout(fn_blockAD,1000);
        }
        let url=null;
        const fn_checkvideo=function(){
            const r=document.querySelectorAll("video.fp-engine");
            let found=false;
            (r||[]).forEach(function(e_video){
                url=e_video.getAttribute("src");
                found=true;
            });
            if(!found){
                GM_log("Not Found");
                window.setTimeout(fn_checkvideo,1000);
            }else{
                GM_log("Found");
                const el=GM_addElement(document.querySelector("body"),"div",{
                    style:"padding:15px;cursor:pointer;position: fixed;left:0px;top:0px;background-color:white;border:blue solid 1px;",
                });
                const el_div=GM_addElement(el,"div",{});
                el_div.innerHTML=`标题： ${document.title}'<br/>地址： ${url}`;
                const el_button=GM_addElement(el,"button",{
                    style:"font-size:14px;",
                    textContent:"复制tktube命令",
                });
                el_button.addEventListener("click",()=>{
                    const text=`tktube '${document.title}' '${url}' '${document.cookie}'`;
                    GM_setClipboard(text,{ type: 'text', mimetype: 'text/plain'});

                });

            }
        };

        const fn_titleAlt=function(){
            document.querySelectorAll("strong.title").forEach((el)=>{
                const alt=el.getAttribute("alt");
                if(alt==null){
                    const el_a=el.closest("a");
                    if(el_a!=null){
                        el.setAttribute("alt",el.innerText);
                        el_a.addEventListener("mouseover",(event)=>{
                            el.style.height="unset";
                        });
                        el_a.addEventListener("mouseout",(event)=>{
                            el.style.height="";

                        });
                    }
                }
            });
            window.setTimeout(fn_titleAlt,1000);
        }
        fn_blockAD();
        fn_checkvideo();
        fn_titleAlt();
    }
    const fn_jable=function(){
        GM_log("Match Jable");
        const fn_blockAD=function(){
            try{
                const selector=""
                +"iframe"
                +"";
                document.querySelectorAll(selector).forEach((el)=>{
                    el.remove();
                });

            }catch(e){}

            window.setTimeout(fn_blockAD,1000);
        }
        const fn_checkvideo=function(){
            if(typeof hlsUrl == "string"){
                GM_log("Found");
                const url=hlsUrl;
                GM_log(url);
                const title_re=/^(.*)\s-\sJable\.TV.*$/;
                let title=document.title;
                if(title_re.test(title)){
                    title=title.match(title_re)[1];
                }

                const el=GM_addElement(document.querySelector("body"),"div",{
                    style:"font-size:12px;padding:15px;cursor:pointer;position: fixed;left:0px;bottom:0px;background-color:white;border:blue solid 1px;",
                });
                const el_div=GM_addElement(el,"div",{});
                el_div.innerHTML=`标题： ${title}'<br/>地址： ${url}`;
                const el_button=GM_addElement(el,"button",{
                    style:"font-size:14px;",
                    textContent:"复制jable命令",
                });
                el_button.addEventListener("click",()=>{
                    const text=`jable '${title}' '${url}'`;
                    GM_setClipboard(text,{ type: 'text', mimetype: 'text/plain'});

                });
            }else{
                GM_log("Not Found");
                window.setTimeout(fn_checkvideo,1000);
            }
        };
        fn_blockAD();
        fn_checkvideo();

    }
    const href=document.location.href;
    const match=[
        {
            "re":/^https:\/\/tktube.com\//,
            "fn":fn_tktube,
        },
        {
            "re":/^https:\/\/jable.tv\//,
            "fn":fn_jable,
        }
    ];

    for(let i=0;i<match.length;i++){
        const m=match[i];
        if(m.re.test(href)){
            m.fn();
            break;
        }
    }
})();
