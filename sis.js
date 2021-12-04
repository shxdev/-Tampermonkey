// ==UserScript==
// @name         SIS
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include        /^https?:\/\/sexinsex.net\//
// @include        /^https?:\/\/sis001.com\//
// @icon         https://www.google.com/s2/favicons?domain=sexinsex.net
// @grant        GM_addElement
// @grant        GM_log
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';
    const fn_sis=function(){
        GM_log("Match SIS");
        const fn_blockAD=function(){
            try{
                const selector="div#ad_headerbanner"
                +",div#ad_text"
                +",div#ad_footerbanner1"
                +",div#ad_thread3_0";
                document.querySelectorAll(selector).forEach((el)=>{
                    el.remove();
                });

            }catch(e){}

            window.setTimeout(fn_blockAD,1000);
        }
        let url=null;
        const fn_hideleft=function(){
            const r=document.querySelectorAll("td.postauthor");
            let found=false;
            (r||[]).forEach(function(postauthor){
                postauthor.style.width="0px";
            });
            window.setTimeout(fn_hideleft,1000);
        };
        fn_blockAD();
        fn_hideleft();
    }
    const fn_sis001=function(){
        GM_log("Match SIS001");
        const fn_blockAD=function(){
            try{
                const selector="div#ad_headerbanner"
                +",div#ad_text"
                +",div#ad_footerbanner1"
                +",div#ad_thread3_0";
                document.querySelectorAll(selector).forEach((el)=>{
                    el.remove();
                });

            }catch(e){}

            window.setTimeout(fn_blockAD,1000);
        }
        let url=null;
        const fn_hideleft=function(){
            const r=document.querySelectorAll("td.postauthor");
            let found=false;
            (r||[]).forEach(function(postauthor){
                postauthor.style.width="0px";
            });
            const r_msg=document.querySelectorAll(".noSelect");
            (r_msg||[]).forEach(function(t_msgfont){
                t_msgfont.classList.remove("noSelect");
            });
            window.setTimeout(fn_hideleft,1000);
        };
        fn_blockAD();
        fn_hideleft();
    }

    const href=document.location.href;
    const match=[
        {
            "re":/^https?:\/\/sexinsex.net\//,
            "fn":fn_sis,
        },
        {
            "re":/^https?:\/\/sis001.com\//,
            "fn":fn_sis001,
        },
    ];

    for(let i=0;i<match.length;i++){
        const m=match[i];
        if(m.re.test(href)){
            m.fn();
            break;
        }
    }
})();
