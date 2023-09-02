<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import Leaderboard, { TopRankings } from '../scripts/leaderboard'

const leaderboard = Leaderboard.instance
const loaded = ref(false)
let rankings: TopRankings

onMounted(() => {
    setTimeout(async () => {
        rankings = await leaderboard.getRankings()
        loaded.value = true
    }, 2000)
})
</script>

<template>
<div id='rankings' v-if='loaded'>
    <div class='Podium' id='overall'>
        <div class='Ranking First'>
            <div class='Number Gold'>1</div>
            <div class='Info'>
                <div class='Username'>{{ rankings.overall[0].username  }}</div>
                <div class='Points'>{{ rankings.overall[0].points  }} scores vanquished</div>
            </div>
        </div>
        <div id='bottomRow'>
            <div class='Ranking Second'>
                <div class='Number Silver'>2</div>
                <div class='Info'>
                    <div class='Username'>{{ rankings.overall[1].username  }}</div>
                    <div class='Points'>{{ rankings.overall[1].points  }}</div>
                </div>
            </div>
            <div class='Ranking Third'>
                <div class='Number Bronze'>3</div>
                <div class='Info'>
                    <div class='Username'>{{ rankings.overall[2].username  }}</div>
                    <div class='Points'>{{ rankings.overall[2].points  }}</div>
                </div>
            </div>
        </div>
    </div>
    <div id='categories'>
        <div class='Category' v-for="category in ['Lead', 'Rhythm', 'Bass']">
            <div class='CategoryName' :class='category'>{{ category }}</div>
            <div>
                <div class='Ranking' v-for='ranking in rankings[category.toLowerCase() as keyof TopRankings]'>
                    {{ ranking.username }}
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<style scoped>
#rankings {
    width: 100%;
    padding: 1rem;

    color: white;

    background-color: var(--dark-gray);
    border-radius: .25rem;
}

.Number {
    display: inline-block;
    width: 2rem;
    height: 2rem;
    margin-right: 1rem;

    font-size: 1.5rem;

    border-radius: 50%;

    /* color: var(--dark-gray); */
}

/* .Gold {
    background-color: rgb(180, 180, 50);
}

.Silver {
    background-color: rgb(150, 150, 150);
}

.Bronze {
    background-color: rgb(150, 100, 0);
} */

.Podium {
    text-align: center;
}

.Ranking {
    display: inline-flex;
    align-items: center;
    padding: .5rem;

    /* border-bottom: 1px solid white; */
}

.Info {
    display: inline-block;
}

.First .Username {
    font-size: 1.5rem;
}

#bottomRow {
    display: flex;
    justify-content: space-between;

    margin: auto;
    margin-top: 1rem;
    margin-bottom: 1rem;
    width: 40%;

    border-bottom: 1px solid white;
}

#categories {
    display: flex;
    justify-content: space-between;

    margin: auto;

    width: 60%;
}

.CategoryName {
    padding: .25rem;
    padding-left: .5rem;
    padding-right: .5rem;

    border: 1px solid white;
    border-radius: .25rem;
}

/* .Lead {
    background-color: var(--color-orange);
}

.Rhythm {
    background-color: var(--color-green);
}

.Bass {
    background-color: var(--color-blue);
} */
</style>