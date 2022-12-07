//=============================================================================
// OverkillTrigger.js
//=============================================================================

/*:
 * @plugindesc Trigger an event on Overkill
 * @author Weston Mitchell (Pandan)
 *
 * @help This plugin does not provide plugin commands.
 *
 * Usage examples of this plugin:
 * - Trigger an attack on overkill, using overkill damage value to do more things.
 * - Add <overkillSplash> tag to the note of a weapon, spell, or item to enable for said item.
 */

/*:ja
 * @plugindesc Trigger an event on Overkill
 * @author Weston Mitchell (Pandan)
 *
 * @help learn english
 */

console.log('Pandan Overkill Loaded');

(function() {

  
  var lastActionOverkill = false;
  var ok_action;
  var ok_target;
  var ok_amount;
  // globals

  var rpgupdateAction = BattleManager.prototype.updateAction;
  BattleManager.prototype.updateAction = function () {
  console.log("updateAction took place here");
  rpgupdateAction.call(this);
  };

  overkillEffect = function(action, target, overkillamount){
    console.log(target);
    var enemyName = $dataEnemies[target._enemyId].name + target._letter;
    console.log(enemyName + overkillamount +'  overkill damage!'); 
    var modAction = action;
    var allTargets = action.makeTargets();
    //var dmg = overkillamount/allTargets.length-1;
    for (let i = 0; i < allTargets.length; i++)
    {
      t = allTargets[i];
      var dead = t.isDead();
      if(!dead && t != target)
      {
        modAction.apply(t);
      }
    }
  };
  //The only thing it cant do right now, is we cant modifiy the new spell with a custom damage value (based on previous overkill)
  // We can do direct HP damage though, which might work if we could clean up the actors after death
  
  var rpgExecuteHpDamage = Game_Action.prototype.executeHpDamage;
  Game_Action.prototype.executeHpDamage = function (target, value) {
    var curHp = target.hp;
    rpgExecuteHpDamage.call(this, target, value);
    var action = this;
    var note = action._item.object().note;
    console.log(this);
    if(note.includes("<overkillSplash>")){
      if(target.isEnemy() && (target.isDead())){
        var overkillamount = value - curHp;
        if(overkillamount > 1){
          ok_action = action; 
          ok_target = target;
          ok_amount = overkillamount;
          console.log(target.battlerName() + ' was overkilled by '+ overkillamount + ' damage!');
        } else {
        }
      }
      SceneManager._scene._logWindow.addText(target.battlerName() + ' hp:'+target.hp);
    }
  };

})();

