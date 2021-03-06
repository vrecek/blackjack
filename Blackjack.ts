export default class Blackjack {
   private card_images:Array<string>
   private enemy_score:number
   private enemy_hold:boolean
   private player_score:number
   private player_hold:boolean
   private player_money:number
   private bet_value:number

   /* ----------------------------------------------------------------------------- */

   private cardScore(num:number, arr:Array<number>, turn:string) {
      switch(num) {
         case 0: case 1: case 2: 
         case 3: case 4: case 5: 
         case 6: case 7: case 8:
            arr.push(num + 2)
         break;

         case 9: case 10: case 11:
            arr.push(10)
         break;

         case 12:
            if(turn === 'player') {
               arr.push( this.player_score + 11 > 21 ? 1 : 11 )
               break;
            }

            arr.push( this.enemy_score + 11 > 21 ? 1 : 11 )
            break;
      }

      return arr
   }

   private enemyHold(nextNum:number):boolean {
      if(this.enemy_hold) return true

      const arr = this.cardScore(nextNum, [], 'enemy')

      const more21 = this.enemy_score + arr[0] > 21

      if(this.player_hold && this.enemy_score > this.player_score) return true

      if(more21 && this.player_score <= this.enemy_score) {
         const over = 21 - this.enemy_score

         const rand = Math.floor(Math.random() * 100) + 1

         if(rand <= over) {
            return false
         }

         this.enemy_hold = true
         return true
      }

      return false
   }

   /* ----------------------------------------------------------------------------- */

   public constructor(card_images:Array<string>, starter_plr_money:number, betVal:number) {
      this.player_score = 0
      this.enemy_score = 0
      this.enemy_hold = false
      this.card_images = card_images
      this.player_money = starter_plr_money
      this.player_hold = false
      this.bet_value = betVal
   }

   public draw(player_and_enemy_fields:Array<HTMLElement | Element>, enemyHoldText?:HTMLElement | Element):Array<number> {
      if(player_and_enemy_fields.length !== 2) throw new Error('Fields must be for a player and enemy')

      const rands:Array<number> = [...Array(2)].map(x => Math.floor(Math.random() * this.card_images.length))
      const score:Array<number> = []
      const turnarray:Array<any> = [...player_and_enemy_fields]

      const enemy_hold = this.enemyHold(rands[1])
      if(enemy_hold) {
         turnarray.splice(1, 1)
         enemyHoldText ? enemyHoldText.textContent = '(hold)': null
      }

      for( let [i, x] of Object.entries(turnarray) ) {
         const rand = rands[parseInt(i)]

         let turn:string = 'enemy'
         if(turnarray.length === 2) {
            turn = parseInt(i) === 0 ? 'player' : 'enemy'
         } 

         const img = document.createElement('img')
         img.src = this.card_images[rand]

         this.cardScore(rand, score, turn)

         x.appendChild(img)
      }

      this.player_score += (score[0] || 0)
      this.enemy_score += (score[1] || 0)

      return score
   }

   public returnWinner(dontAddMoney?:boolean):string {
      if(
         ((this.player_score > 21 && this.enemy_score > 21) &&
         (this.player_score === this.enemy_score)) 
         ||
         (this.player_score === 21 && this.enemy_score === 21)
         ||
         ((this.player_score === this.enemy_score) &&
         (this.player_hold && this.enemyHold))
      ) {
         return 'DRAW'
      }

      if(this.player_score > 21 || this.enemy_score > 21) {
         const res = this.player_score > this.enemy_score ? 'enemy' : 'player'

         dontAddMoney ? null : res === 'player' ? this.player_money += (this.bet_value) * 2 : this.player_money -= this.bet_value

         return res
      }

      if(
         (this.player_score === 21 || this.enemy_score > 21) ||
         (this.enemy_hold && this.player_score > this.enemy_score)
      ) {
         dontAddMoney ? null : this.player_money += (this.bet_value * 2)
         
         return 'player'
      }

      if(
         (this.enemy_score === 21 || this.player_score > 21) ||
         (this.player_hold && this.enemy_score > this.player_score)
      ) {
         dontAddMoney ? null : this.player_money -= this.bet_value

         return 'enemy'
      }

      return ''
   }

   public hold(enemy_board:HTMLElement | Element, enemy_score:HTMLElement | Element, enemyHoldText?:HTMLElement | Element):void {
      this.player_hold = true

      while(!this.returnWinner(true)) {
         const rand = Math.floor(Math.random() * this.card_images.length)

         if(this.enemyHold(rand)) {
            enemyHoldText ? enemyHoldText.textContent = '(hold)': null
            break
         }

         const score = this.cardScore(rand, [], 'enemy')

         const img = document.createElement('img')
         img.src = this.card_images[rand]

         enemy_board.appendChild(img)
         this.enemy_score += (score[0] || 0)
         enemy_score.textContent = (parseInt(enemy_score.textContent!) + score[0]).toString()
      }
   }

   public restartGame(player_and_enemy_fields:Array<HTMLElement | Element>, scores_cont:Array<HTMLElement | Element>):void {
      if(player_and_enemy_fields.length !== 2) throw new Error('Fields must be for a player and enemy')

      this.player_score = 0
      this.enemy_score = 0
      this.enemy_hold = false
      this.player_hold = false

      for(let i = 0; i <= 1; i++) {
         scores_cont[i].textContent = '0'

         for( let x of Array.from(player_and_enemy_fields[i].children) ) x.remove()
      }
   }

   public set setBetValue(value:number) {
      if(this.player_money > value) {
         this.bet_value = value
      }
   }

   public get getMoney():number {
      return this.player_money
   }
}