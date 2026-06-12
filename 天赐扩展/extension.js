game.import("extension",function(lib,game,ui,get,ai,_status){return {name:"天赐拓展",content:function(config,pack){

},precontent:function(){
    if(!lib.group.contains("feng")){
        game.addGroup("feng","冯","朝阳","pink");
    }
},help:{},config:{},package:{
    character:{
        character:{
            "tianci":["male","feng",4,["逆天运气","监管者鸡龙","冯冯杀","辨忠奸"],["卡牌玩家"],["die","tianci_die"]],
        },
        translate:{
            "tianci":"天赐",
            "tianci_prefix":"朝阳",
            "tianci_info":"朝阳·天赐，卡牌玩家。",
        },
        characterTitle:{
            "tianci":"卡牌玩家",
        },
    },
    card:{
        card:{
        },
        translate:{
        },
        list:[],
    },
    skill:{
        skill:{
            "逆天运气":{
                trigger:{player:"phaseBegin"},
                frequent:true,
                audio:"ext:天赐拓展:2",
                filter:function(event,player){
                    return player.countCards("he")>0;
                },
                content:function(){
                    "step 0"
                    player.popup("逆天运气","gold");
                    player.say("运气也是实力的一部分！");
                    var num=Math.min(2,player.countCards("he"));
                    player.chooseToDiscard("he",[1,num],"逆天运气：弃置1~2张牌").set("ai",function(card){
                        return 7-get.value(card);
                    });
                    "step 1"
                    if(result.bool&&result.cards&&result.cards.length>0){
                        event.discardNum=result.cards.length;
                        var basicNames=["sha","huo_sha","lei_sha","tao","jiu","shan"];
                        var trickNames=["shunshou","guohe","wuzhong","lebu","bingliang","tiesuo","wuxie","shandian","huogong"];
                        event.basicCards=[];
                        event.trickCards=[];
                        for(var i=0;i<basicNames.length;i++){
                            var name=basicNames[i];
                            var card=get.cardPile(function(c){
                                return get.name(c)==name;
                            },"filed");
                            if(card){
                                event.basicCards.push(card);
                            }
                        }
                        for(var i=0;i<trickNames.length;i++){
                            var name=trickNames[i];
                            var card=get.cardPile(function(c){
                                return get.name(c)==name;
                            },"filed");
                            if(card){
                                event.trickCards.push(card);
                            }
                        }
                        if(event.basicCards.length>0){
                            var dialog=ui.create.dialog("逆天运气：选择一张基本牌",[event.basicCards,"vcard"]);
                            player.chooseButton(dialog).set("ai",function(button){
                                return Math.random();
                            });
                        }
                        else{
                            if(event.discardNum==1){
                                player.draw(2);
                            }
                            event.finish();
                        }
                    }
                    else{
                        event.finish();
                    }
                    "step 2"
                    if(result.bool&&result.links&&result.links.length>0){
                        event.basicCard=result.links[0];
                    }
                    if(event.dialog) event.dialog.close();
                    if(event.discardNum==1){
                        if(event.basicCard){
                            player.gain(event.basicCard);
                        }
                        event.finish();
                    }
                    else{
                        if(event.trickCards.length>0){
                            var dialog2=ui.create.dialog("逆天运气：选择一张锦囊牌",[event.trickCards,"vcard"]);
                            player.chooseButton(dialog2).set("ai",function(button){
                                return Math.random();
                            });
                        }
                        else{
                            player.gain(event.basicCard);
                            player.draw(2);
                            event.finish();
                        }
                    }
                    "step 3"
                    if(result.bool&&result.links&&result.links.length>0){
                        event.trickCard=result.links[0];
                    }
                    if(event.dialog) event.dialog.close();
                    if(event.basicCard){
                        player.gain(event.basicCard);
                    }
                    if(event.trickCard){
                        player.gain(event.trickCard);
                    }
                },
                ai:{
                    threaten:2,
                },
            },
            "监管者鸡龙":{
                trigger:{player:["useCard","respond"]},
                frequent:true,
                content:function(){
                    player.popup("嗷！");
                    player.storage.监管者鸡龙_aotag=player.storage.监管者鸡龙_aotag||0;
                    player.storage.监管者鸡龙_aotag++;
                    player.popup("嗷！");
                },
                init:function(player,skill){
                    player.storage[skill+"_aotag"]=player.storage[skill+"_aotag"]||0;
                },
                mark:true,
                marktext:"嗷",
                intro:{
                    content:function(storage,player,skill){
                        return "当前嗷标记数："+(player.storage.监管者鸡龙_aotag||0);
                    },
                },
                group:["监管者鸡龙_phaseBegin","监管者鸡龙_phaseEnd"],
                ai:{
                    threaten:2,
                },
            },
            "监管者鸡龙_phaseBegin":{
                trigger:{player:"phaseBegin"},
                forced:true,
                priority:1,
                audio:"ext:天赐拓展:2",
                filter:function(event,player){
                    if(player.storage.冯冯杀_移除开始) return false;
                    return (player.storage.监管者鸡龙_aotag||0)>0;
                },
                content:function(){
                    "step 0"
                    player.say("让命运来审判吧！");
                    player.judge();
                    "step 1"
                    var num=player.storage.监管者鸡龙_aotag||0;
                    var reversed=player.storage.冯冯杀_反转比较||false;
                    event.isPunish=reversed?(result.number<num):(result.number>num);
                    event.isReward=reversed?(result.number>num):(result.number<num);
                    if(event.isPunish){
                        player.chooseToDiscard("he",2,"监管者鸡龙：弃置两张牌或受到1点伤害").set("ai",function(card){
                            return 1;
                        }).set("goon",function(){
                            return player.countCards("he")>=2;
                        });
                    }
                    else if(event.isReward){
                        player.chooseControl(["摸两张牌","回复一点体力"]);
                    }
                    else{
                        event.finish();
                    }
                    "step 2"
                    if(event.isPunish){
                        if(!result.bool){
                            player.damage(1,"nosource");
                            player.storage.监管者鸡龙_aotag=0;
                            player.unmarkSkill("监管者鸡龙");
                            player.markSkill("监管者鸡龙");
                        }
                        else{
                            player.storage.监管者鸡龙_aotag=0;
                            player.unmarkSkill("监管者鸡龙");
                            player.markSkill("监管者鸡龙");
                        }
                    }
                    else if(event.isReward){
                        if(result.control=="摸两张牌"){
                            player.draw(2);
                        }
                        else{
                            player.recover(1);
                            player.storage.监管者鸡龙_aotag=0;
                            player.unmarkSkill("监管者鸡龙");
                            player.markSkill("监管者鸡龙");
                        }
                    }
                },
                ai:{
                    threaten:2,
                },
            },
            "监管者鸡龙_phaseEnd":{
                trigger:{player:"phaseEnd"},
                forced:true,
                audio:"ext:天赐拓展:2",
                filter:function(event,player){
                    if(player.storage.冯冯杀_移除结束) return false;
                    return (player.storage.监管者鸡龙_aotag||0)>0;
                },
                content:function(){
                    "step 0"
                    player.say("回合结束，审判时刻！");
                    player.judge();
                    "step 1"
                    var num=player.storage.监管者鸡龙_aotag||0;
                    var reversed=player.storage.冯冯杀_反转比较||false;
                    event.isPunish=reversed?(result.number<num):(result.number>num);
                    event.isReward=reversed?(result.number>num):(result.number<num);
                    if(event.isPunish){
                        player.chooseToDiscard("he",2,"监管者鸡龙：弃置两张牌或受到1点伤害").set("ai",function(card){
                            return 1;
                        }).set("goon",function(){
                            return player.countCards("he")>=2;
                        });
                    }
                    else if(event.isReward){
                        player.chooseControl(["摸两张牌","回复一点体力"]);
                    }
                    else{
                        event.finish();
                    }
                    "step 2"
                    if(event.isPunish){
                        if(!result.bool){
                            player.damage(1,"nosource");
                            player.storage.监管者鸡龙_aotag=0;
                            player.unmarkSkill("监管者鸡龙");
                            player.markSkill("监管者鸡龙");
                        }
                        else{
                            player.storage.监管者鸡龙_aotag=0;
                            player.unmarkSkill("监管者鸡龙");
                            player.markSkill("监管者鸡龙");
                        }
                    }
                    else if(event.isReward){
                        if(result.control=="摸两张牌"){
                            player.draw(2);
                        }
                        else{
                            player.recover(1);
                            player.storage.监管者鸡龙_aotag=0;
                            player.unmarkSkill("监管者鸡龙");
                            player.markSkill("监管者鸡龙");
                        }
                    }
                },
                ai:{
                    threaten:2,
                },
            },
            "冯冯杀":{
                trigger:{global:"roundStart"},
                frequent:true,
                audio:"ext:天赐拓展:2",
                content:function(){
                    "step 0"
                    player.popup("冯冯杀","fire");
                    player.say("冯冯杀！调整形态！");
                    player.storage.冯冯杀_反转比较=false;
                    player.storage.冯冯杀_移除开始=false;
                    player.storage.冯冯杀_移除结束=false;
                    player.chooseControl(["反转比较","移除回合开始","移除回合结束"]);
                    "step 1"
                    if(result.control=="反转比较"){
                        player.storage.冯冯杀_反转比较=true;
                        player.popup("反转比较");
                    }
                    else if(result.control=="移除回合开始"){
                        player.storage.冯冯杀_移除开始=true;
                        player.popup("已移除回合开始判定");
                    }
                    else if(result.control=="移除回合结束"){
                        player.storage.冯冯杀_移除结束=true;
                        player.popup("已移除回合结束判定");
                    }
                },
                ai:{
                    threaten:2,
                },
            },
            "辨忠奸":{
                trigger:{player:"enterGame",global:"gameStart"},
                zhuSkill:true,
                forced:true,
                audio:"ext:天赐拓展:2",
                content:function(){
                    "step 0"
                    player.popup("辨忠奸","skyblue");
                    player.say("忠奸善恶，我自明辨！");
                    player.chooseTarget(function(card,player,target){
                        return target!=player;
                    },true,"辨忠奸：选择一名玩家，令其获得【护忠】或【诛奸】").set("ai",function(target){
                        return 1;
                    });
                    "step 1"
                    if(result.bool&&result.targets&&result.targets.length>0){
                        event.target=result.targets[0];
                        player.chooseControl(["护忠","诛奸"]);
                    }
                    else{
                        event.finish();
                    }
                    "step 2"
                    if(result.control=="护忠"){
                        event.target.addSkill("护忠");
                        event.target.storage.辨忠奸_天赐=player;
                        player.storage.辨忠奸_目标=event.target;
                        player.storage.辨忠奸_技能="护忠";
                    }
                    else{
                        event.target.addSkill("诛奸");
                        event.target.storage.辨忠奸_天赐=player;
                        player.storage.辨忠奸_目标=event.target;
                        player.storage.辨忠奸_技能="诛奸";
                    }
                    game.log(player,"令",event.target,"获得了技能【"+result.control+"】");
                },
                init:function(player,skill){
                    player.storage[skill+"_目标"]=null;
                    player.storage[skill+"_技能"]=null;
                },
                ai:{
                    threaten:2,
                },
            },
            "护忠":{
                trigger:{player:"damageBegin"},
                forced:true,
                filter:function(event,player){
                    if(!player.storage.辨忠奸_天赐) return false;
                    if(event.source&&event.source==player.storage.辨忠奸_天赐) return true;
                    return false;
                },
                content:function(){
                    "step 0"
                    player.popup("护忠","green");
                    player.say("忠心护主，义不容辞！");
                    trigger.cancel();
                    player.draw(2);
                    trigger.source.draw(2);
                    game.log(player,"防止了来自",trigger.source,"的伤害，双方各摸两张牌");
                },
                group:"护忠_伤害限制",
                ai:{
                    threaten:2,
                },
            },
            "护忠_伤害限制":{
                trigger:{player:"damageBegin"},
                forced:true,
                filter:function(event,player){
                    if(!player.storage.辨忠奸_天赐) return false;
                    if(event.source&&event.source==player.storage.辨忠奸_天赐) return false;
                    return true;
                },
                content:function(){
                    "step 0"
                    if(player.storage.护忠_本回合受伤){
                        player.say("莫要再来了！");
                        trigger.cancel();
                        game.log(player,"本回合已受过伤，本次伤害被免疫");
                    }
                    else{
                        player.storage.护忠_本回合受伤=true;
                        player.say("暂且饶你一次");
                    }
                },
                init:function(player,skill){
                    player.storage.护忠_本回合受伤=false;
                },
                onremove:function(player,skill){
                    delete player.storage.护忠_本回合受伤;
                },
                ai:{
                    threaten:2,
                },
            },
            "诛奸":{
                trigger:{player:"damageBegin"},
                forced:true,
                filter:function(event,player){
                    return event.source&&player.storage.辨忠奸_天赐&&event.source==player.storage.辨忠奸_天赐;
                },
                content:function(){
                    "step 0"
                    player.popup("诛奸","firebrick");
                    player.say("逆贼受死！");
                    trigger.num++;
                    game.log(player,"受到的伤害+1");
                    trigger.source.draw(2);
                    game.log(trigger.source,"摸了2张牌");
                },
                group:"诛奸_死亡",
                ai:{
                    threaten:2,
                },
            },
            "诛奸_死亡":{
                trigger:{player:"die"},
                forced:true,
                filter:function(event,player){
                    return player.storage.辨忠奸_天赐&&player==event.player;
                },
                content:function(){
                    "step 0"
                    var tianci=player.storage.辨忠奸_天赐;
                    var identity=event.player.identity;
                    if(identity=="zhong"){
                        player.say("主公，臣去也...");
                        tianci.loseMaxHp();
                        game.log(tianci,"因",event.player,"身份为忠臣，体力上限-1");
                    }
                    else if(identity=="fan"){
                        player.say("反贼已诛，死而无憾！");
                        tianci.draw(3);
                        tianci.gainMaxHp();
                        game.log(tianci,"因",event.player,"身份为反贼，摸3张牌，体力上限+1");
                    }
                },
                ai:{
                    threaten:2,
                },
            },
        },
        translate:{
            "逆天运气":"逆天运气",
            "逆天运气_info":"你的回合开始，最多可以弃置两张牌。若弃置一张，从牌堆中获得一张你指定的基本牌；若弃置两张，从牌堆中获得一张你指定的基本牌和一张你指定的锦囊牌。你每因牌堆中没有对应牌而无法获得牌时，改为摸两张牌。",
            "监管者鸡龙":"监管者鸡龙",
            "监管者鸡龙_info":"你每使用或打出一张牌，获得一个”嗷！“标记。你的回合开始与回合结束时进行一次判定，若判定结果大于”嗷！“标记数，你须弃置两张牌或受到一点无来源伤害；若判定结果小于”嗷！“标记数，你摸两张牌或回复一点体力。",
            "监管者鸡龙_aotag":"嗷！",
            "监管者鸡龙_aotag_info":"当前共有%s个嗷！标记。",
            "冯冯杀":"冯冯杀",
            "冯冯杀_info":"每轮开始时，你可以将【监管者鸡龙】修改：1.判定效果反转，2.移除回合开始判定，3.移除回合结束判定。",
            "辨忠奸":"辨忠奸",
            "辨忠奸_info":"游戏开始时，你选择一名玩家，令其获得以下两个技能之一：1.【护忠】其每回合至多受到1点伤害，你对其造成的伤害时，无效此次次伤害，然后你与其各摸两张牌；2.【诛奸】其受到你造成的伤害+1，其每受到1点伤害你摸两张牌，其死亡后若为忠臣你减1点体力上限，若为反贼你摸三张牌并加1点体力上限。",
            "护忠":"护忠",
            "护忠_info":"每回合至多受到1点伤害。“天赐”对你造成的伤害时使伤害无效然后双方各摸两张牌。",
            "诛奸":"诛奸",
            "诛奸_info":"受到的伤害+1，每次受伤时“天赐”摸两张牌。死亡后根据身份触发效果。",
        },
    },
    intro:"天赐拓展 - 朝阳·天赐，卡牌玩家。",
    author:"无名玩家",
    diskURL:"",
    forumURL:"",
    version:"1.0.0",
},files:{"character":["tianci.jpg","tianci2.jpg"],"card":[],"skill":[],"audio":[]}}})
