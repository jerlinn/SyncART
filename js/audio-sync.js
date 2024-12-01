document.addEventListener('DOMContentLoaded', function() {
    // 获取所有音频播放器容器
    const audioPlayerContainers = document.querySelectorAll('.audio-player-container');

    // 定义每个音频的文本时间轴
    const audioTextTimelines = {
        'Ava-au1.m4a': [
            { time: 0.0, text: "⭐ Rise and shine, EMMA!" },
            { time: 1.48, text: "Oh my god, it's a perfect 55°F degrees morning in SF." },
            { time: 6.38, text: "- literally ideal running weather. You're gonna love this:" },
            { time: 9.98, text: "The Presidio trails are looking absolutely gorgeous today." },
            { time: 13.4, text: "Remember when you could barely finish 3 miles?" },
            { time: 16.4, text: "Now you're crushing 8-mile runs like it's no big deal." },
            { time: 19.94, text: "That's some serious level-up energy right there." },
            { time: 23.64, text: "Fun science fact of the day: your muscles actually love these cool morning temps" },
            { time: 29.22, text: "- it's like getting a natural performance boost." },
            { time: 32.16, text: "Just don't forget your fuel stops every 30 minutes." },
            { time: 35.28, text: "(I know, I know, I sound like such a coach right now.)" },
            { time: 38.28, text: "Pro tip: Those hills you've been training on? They're basically your secret weapon for race day." },
            { time: 43.52, text: "Trust me, you're going to thank yourself when you're zooming past everyone else!" },
            { time: 48.30, text: "Keep being amazing - every step is taking you closer to that finish line!" }
        ],
        'Phoebe-au2.m4a': [
            { time: 0.0, text: "💡 Hey MICHAEL! Catching that golden hour at 6:15 in SF" },
            { time: 4.62, text: "- Love to see that consistency!" },
            { time: 6.9, text: "Quick thought for today: you know what's wild?" },
            { time: 12.18, text: "The whole work-from-anywhere revolution has totally changed the FIRE game." },
            { time: 16.16, text: "Get this - 87% of tech roles are now location-flexible." },
            { time: 20.06, text: "Pretty sweet for someone eyeing that 2035 freedom, right?" },
            { time: 24.82, text: "Here's what's got me excited: I'm seeing more and more folks in our community crushing their FIRE goals" },
            { time: 27.58, text: "by thinking outside the Bay Area box." },
            { time: 32.60, text: "They're keeping those sweet tech salaries while exploring some seriously cool lifestyle options." },
            { time: 37.78, text: "Food for thought: Where could your skills take you?" },
            { time: 41.14, text: "The world's getting smaller, but the opportunities? They're exploding." },
            { time: 44.50, text: "Keep rocking that morning routine - you're building something special here!" }
        ],
        'Cora-au3.m4a': [
            { time: 0.0, text: "🧘‍♀️ Hey Jen! Love seeing you claim this 5:45 sacred space. Remember when you thought meditation was" },
            { time: 5.94, text: "just another productivity hack? Now look at you, embracing these quiet moments like an old friend." },
            { time: 12.08, text: "Today's insight: Watching the sunrise over the bay bridge this morning - noticed how the light" },
            { time: 17.54, text: "changes gradually? No rushing, no pushing, just natural unfolding. Kinda like your journey with" },
            { time: 23.28, text: "mindfulness, right? Leadership nugget: When that all hands gets intense today remember your 'pause" },
            { time: 28.80, text: "practice' - that micro-moment between stimulus and response where your best decisions live." },
            { time: 34.12, text: "You're really owning that space now! Keep nurturing this practice, Jen - you're" },
            { time: 38.48, text: "redefining what conscious leadership looks like in tech one breath at a time." }
        ]
    };

    audioPlayerContainers.forEach(container => {
        const audio = container.querySelector('audio');
        const digitalText = container.querySelector('.digital-text');
        const audioFileName = audio.getAttribute('src').split('/').pop();
        const timeline = audioTextTimelines[audioFileName];

        if (!timeline) return;

        // 监听时间更新事件
        audio.addEventListener('timeupdate', function() {
            const currentTime = audio.currentTime;
            
            // 查找当前时间对应的文本
            const currentTextObj = timeline.reduce((prev, curr) => {
                if (currentTime >= curr.time && curr.time > prev.time) {
                    return curr;
                }
                return prev;
            }, timeline[0]);

            // 更新文本显示
            if (currentTextObj) {
                digitalText.textContent = currentTextObj.text;
            }
        });

        // 音频结束时重置文本
        audio.addEventListener('ended', function() {
            digitalText.textContent = timeline[0].text;
        });
    });
});
