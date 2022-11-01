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
 * - Add as a skill ID on an ability or weapon
 */

/*:ja
 * @plugindesc Trigger an event on Overkill
 * @author Weston Mitchell (Pandan)
 *
 * @help learn english
 */

console.log('Pandan Overkill Loaded');

(function() {

  //
  // Game_Action
  //
  //Game_Action.OVERKILL_FLAG = true;

  overkillEffect = function(action, target, overkillamount){
    console.log(target);
    var enemyName = $dataEnemies[target._enemyId].name + target._letter;
    console.log(enemyName + overkillamount +'  overkill damage!'); 
    var modAction = action;
    var allTargets = action.makeTargets();
    var dmg = overkillamount/allTargets.length-1;
    for (let i = 0; i < allTargets.length; i++)
    {
      t = allTargets[i];
      var dead = t.isDead();
      if(!dead && t != target)
      {
        //modAction._item.object().
        modAction.apply(t);
        var battlerName = t.battlerName();
        SceneManager._scene._logWindow.addText(battlerName + ' took '+ dmg +' in overkill damage!')
        if(t.hp <= 0){
          t.die();
          t.refresh();
        }
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
        overkillEffect(action, target, overkillamount);
      }
      SceneManager._scene._logWindow.addText(target.battlerName() + ' hp:'+target.hp);
      console.log(target.battlerName() + ' hp:'+ target.hp);
    }
  };

})();

