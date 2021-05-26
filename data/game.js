const GAME={
  name:"Goldscrolls",
  author:"KesieV",
  year:"2021",
  printUrl:"www.kesiev.com/goldscrolls",
  url:"https://www.kesiev.com/goldscrolls",
  sourcesUrl:"https://github.com/kesiev/goldscrolls",
  version:"0.9b", 
  punchline:[
    "A fast Print-and-Play Roll-and-Write Deckbuilder for two players.",
    "Choose your alchemist, craft, and use scrolls to fight your opponent and win the Goldscrolls tournament!"
  ],
  schools:{
    wanderers:{
      id:"wanderers",
      name:"Wanderers",
      story:[
        "A mysterious collective of wandering alchemists with a rigid and merciless code of life who learns the techniques on the road. It uses so rough and uncontrollable learning methods that some argue that it shouldn't be considered a school at all. But it's the Wanderers adaptability their ace in the hole."
      ],
      howToLearnImage:"tutorial-school-wanderer.png",
      howToLearn:"Roll two dices. You can choose between two powers matching the dice values on the grid in any order. If you roll a pair you must select the relative power on the grid diagonal.",
      title:"the Wanderer",
      layer:"lvl_schoolwanderers",
      powersMap:[
        [[1,2],[2,1]],
        [[1,3],[3,1]],
        [[2,3],[3,2]],
        [[1,4],[4,1]],
        [[2,4],[4,2]],
        [[3,4],[4,3]]
      ]
    },
    merchants:{
      id:"merchants",
      name:"Merchants",
      story:[
        "The Merchants have in their ranks the richest people of the Empire. Their members don't share their knowledge for free: rookies have to pay good money to veterans for their private lessons. The Merchants' motto is 'Gold for Power, Power for Gold' and, considering that their business extends far beyond the walls of the Empire, it is no wonder that their guild is among the most feared and respected."
      ],
      howToLearnImage:"tutorial-school-merchant.png",
      howToLearn:"Pick a dice. You may pay the price of the second dice to pick it too. Roll the dices you picked and choose any power on the rows matching the rolled dices values, paying the price in Gold reported in the coin icon at top of the matching column. You've to pay the power full price to buy it.",
      title:"the Merchant",
      layer:"lvl_schoolmerchants"      
    },
    miners:{
      id:"miners",
      name:"Miners",
      story:[
        "The Miners use the alchemy power to extract minerals from the mountain range of the Edge of the World at the northern side of the Empire. They work in small teams of specialists, so Miner alchemists tend to spend a lot of time and gold to specialize on specific tasks to form a group. An ancient Merchant proverb says 'There is the right miner for every gem' and so is combat: if you have the misfortune to meet the Miner that matches your way of fighting you'll have a bad time."
      ],
      howToLearnImage:"tutorial-school-miner.png",
      howToLearn:"Roll two dices. Select one of the matching rows and then learn one of the crossed skills. If there are no crossed skills in that row you must learn one not crossed skill that has at least one crossed skill on its top - then cross out that skill.",
      title:"the Miner",
      layer:"lvl_schoolminers"      
    }
  }
}