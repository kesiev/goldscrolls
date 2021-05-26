const POWERCATEGORIES={
	plusAttack:{
		label:"+x ATK",
		description:"The target must increase his Attack value OR available Gold value by X."
	},
	plusDefense:{
		label:"+x DEF",
		description:"If the target is the player that activated the power he must increase his Defense value (only if he is undefended) OR available Gold value by X. If the target is an opponent, he must increase his Defense value by X."
	},
	plusGold:{
		label:"+x GOLD",
		description:"The target must increase his available Gold value by X."
	},
	minusGold:{
		label:"-x GOLD",
		description:"The target must decrease his available Gold value by X."
	},
	multipleEffects:{
		label:"+x ATK / +x DEF / ...",
		description:"The target must apply the effects of each line one by one following the order."
	},
	activateAPower:{
		label:"ACTIVATE A POWER",
		description:"The target must learn a power following his character school rules and immediately activate it."
	},
	multipleEffectsOr:{
		label:"+x ATK/DEF",
		description:"The target must increase his Attack value OR Defense value OR available Gold by X."
	},
	learnAnyAttack:{
		label:"Learn any ATK power",
		description:"This power is activated immediately when learned and it can't be written on a scroll. The target must learn any other Attack power (dashed border) from his character sheet School area. Then, if the target is purchasing a scroll write the learned power in that scroll, otherwise he must apply the learned power effects immediately."
	},
	learnAnyDefense:{
		label:"Learn any DEF power",
		description:"This power is activated immediately when learned and it can't be written on a scroll. The target must learn any other Defense power (solid border) from his character sheet School area. Then, if the target is purchasing a scroll write the learned power in that scroll, otherwise he must apply the learned power effects immediately."
	},
	swapAttackDefense:{
		label:"SWAP ATK/DEF",
		description:"The target must swap the Attack and Defense values."
	},
	swapGoldAttack:{
		label:"SWAP GOLD/ATK",
		description:"The target must swap the Gold and Attack values."
	},
	swapGoldDefense:{
		label:"SWAP GOLD/DEF",
		description:"The target must swap the Gold and Defense values."
	},
	linkedScroll:{
		label:"LINKED SCROLL",
		description:"The target must activate all of your exhausted scrolls with a LINKED SCROLL power printed on them. The LINKED SCROLL power has no effect on the scrolls activated this way."
	},
	defenseEqCost:{
		label:"DEF = COST",
		description:"The target must set his Defense value to the scroll cost or the character maximum Defense when not possible. If the power is not activated from a scroll it has no effect."
	},
	attackEqCost:{
		label:"ATK = COST",
		description:"The target must set his Attack value to the scroll cost or the character maximum Attack when not possible. If the power is not activated from a scroll it has no effect."
	},
	goldEqCost:{
		label:"GOLD = COST",
		description:"The target must set his Gold value to the scroll cost or the character maximum Gold when not possible. If the power is not activated from a scroll it has no effect."
	},
	exhaust:{
		label:"EXHAUST x",
		description:"The target must exhaust x scrolls. If there are no more scrolls that can be exhausted, its effect ends."
	},
	ready:{
		label:"READY x",
		description:"The target must ready x exhausted scrolls. If there are no more exhausted scrolls, its effect ends."
	},
	lower:{
		label:"LOWER x",
		description:"The target must lower one of his higher scrolls x times."
	},
	raise:{
		label:"RAISE x",
		description:"The target must raise one of his scrolls x times."
	},
	minusHp:{
		label:"-x HP",
		description:"The target must decrease his Health value by x."
	},
	plusHp:{
		label:"+x HP",
		description:"The target must increase his Health value by x."
	}
};

const POWERS={
	plusOneAttack:{
		category:"plusAttack",
		smallBox:"+1 ATK",
		scrollBox:"+1 ATK"
	},
	plusTwoAttack:{
		category:"plusAttack",
		smallBox:"+2 ATK",
		scrollBox:"+2 ATK"		
	},
	plusOneDefense:{
		category:"plusDefense",
		smallBox:"+1 DEF",
		scrollBox:"+1 DEF"		
	},
	plusTwoDefense:{
		category:"plusDefense",
		smallBox:"+2 DEF",
		scrollBox:"+2 DEF"		
	},
	plusTwoGold:{
		category:"plusGold",
		smallBox:"+2\nGOLD",
		scrollBox:"+2 GOLD"		
	},
	opponentMinusTwoGold:{
		category:"minusGold",
		smallBox:"OPP\n-2\nGOLD",
		scrollBox:"OPPONENT\n-2 GOLD"
	},
	plusOneAttackDefense:{
		category:"multipleEffects",
		smallBox:"+1 ATK\n+1 DEF",
		scrollBox:"+1 ATK\n+1 DEF"			
	},
	plusOneAttackOrDefense:{
		category:"multipleEffectsOr",
		smallBox:"+1\nATK/DEF",
		scrollBox:"+1 ATK/DEF"			
	},
	activateAPower:{
		category:"activateAPower",
		smallBox:"ACTIVATE\nA POWER",
		scrollBox:"ACTIVATE\nA POWER"			
	},
	learnAnyAttack:{
		category:"learnAnyAttack",
		smallBox:"Learn\nany ATK\npower",
		scrollBox:"Learn any\nATK power"
	},
	learnAnyDefense:{
		category:"learnAnyDefense",
		smallBox:"Learn\nany DEF\npower",
		scrollBox:"Learn any\nDEF power"
	},
	swapAttackDefense:{
		category:"swapAttackDefense",
		smallBox:"SWAP\nATK/DEF",
		scrollBox:"SWAP\nATK/DEF"
	},
	swapGoldAttack:{
		category:"swapGoldAttack",
		smallBox:"SWAP\nGOLD/ATK",
		scrollBox:"SWAP\nGOLD/ATK"
	},
	swapGoldDefense:{
		category:"swapGoldDefense",
		smallBox:"SWAP\nGOLD/DEF",
		scrollBox:"SWAP\nGOLD/DEF"
	},
	linkedScroll:{
		category:"linkedScroll",
		smallBox:"LINKED\nSCROLL",
		scrollBox:"LINKED\nSCROLL"
	},
	defenseEqCost:{
		category:"defenseEqCost",
		smallBox:"DEF\n=\nCOST",
		scrollBox:"DEF =\nCOST"
	},
	attackEqCost:{
		category:"attackEqCost",
		smallBox:"ATK\n=\nCOST",
		scrollBox:"ATK =\nCOST"
	},
	goldEqCost:{
		category:"goldEqCost",
		smallBox:"GOLD\n=\nCOST",
		scrollBox:"GOLD =\nCOST"
	},
	opponentExhaustOne:{
		category:"exhaust",
		smallBox:"OPP\nEXHAUST\n1",
		scrollBox:"OPPONENT\nEXHAUST 1"
	},
	readyOne:{
		category:"ready",
		smallBox:"READY 1",
		scrollBox:"READY 1"
	},
	opponentLowerOne:{
		category:"lower",
		smallBox:"OPP\nLOWER\n1",
		scrollBox:"OPPONENT\nLOWER 1"
	},
	raiseOne:{
		category:"raise",
		smallBox:"RAISE 1",
		scrollBox:"RAISE 1"
	},
	opponentMinusOneHp:{
		category:"minusHp",
		smallBox:"OPP\n-1\nHP",
		scrollBox:"OPPONENT\n-1 HP"
	},
	plusOneHp:{
		category:"plusHp",
		smallBox:"+1 HP",
		scrollBox:"+1 HP"
	}
}