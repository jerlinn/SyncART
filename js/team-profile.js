document.addEventListener('DOMContentLoaded', function() {
    const roles = document.querySelectorAll('.role');
    const profileData = {
        'Life Philosophy Expert': {
            name: 'Michael Anderson',
            title: 'Life Philosophy Expert',
            image: 'images/person_team_1.png',
            quote: 'Transforming life\'s complexity into simple wisdom',
            education: [
                'Stanford University, Department of Philosophy',
                'Center for Practical Wisdom & Life Sciences',
                'Ph.D. in Applied Philosophy',
                'Research focus: First Principles in Daily Life'
            ],
            background: [
                'Life Philosophy & Behavioral Science',
                'Focus: Translating Complex Principles into Simple Actions',
                'Certified Life Coach & Philosophy Practitioner',
                'Research Fellow, Institute of Practical Wisdom'
            ],
            experience: [
                '10,000+ Life Transformation Cases',
                'First Principles Application in Daily Life',
                'Personal Growth Pattern Analysis',
                'Wisdom-to-Action Framework Development'
            ]
        },
        'First Principles Researcher': {
            name: 'Sarah Matthews',
            title: 'First Principles Researcher',
            image: 'images/person_team_2.png',
            quote: 'Uncovering the essence of life\'s complexity',
            education: [
                'Northwestern University',
                'Department of Philosophy',
                'M.S. in Life Sciences',
                'Research focus: Fundamental Principles of Life'
            ],
            background: [
                'First Principles Research & Behavioral Science',
                'Research: Fundamental Principles of Human Behavior',
                'Certified Researcher in First Principles',
                'Former researcher at Harvard\'s Department of Philosophy'
            ],
            experience: [
                '5,000+ First Principles Research Cases',
                'Fundamental Principles Application in Daily Life',
                'Personal Growth Pattern Analysis',
                'Wisdom-to-Action Framework Development'
            ]
        },
        'Personal Growth Architect': {
            name: 'James Miller',
            title: 'Personal Growth Architect',
            image: 'images/person_team_3.png',
            quote: 'Designing personalized growth journeys',
            education: [
                'Berklee College of Music',
                'Music Therapy Program',
                'B.A. in Music Therapy',
                'Focus: Personal Growth through Music'
            ],
            background: [
                'Personal Growth Architecture & Music Therapy',
                'MIT Media Lab collaboration: Music & Personal Growth',
                'Certified Music Therapist (MT-BC)'
            ],
            experience: [
                '3,000+ Personal Growth Design Cases',
                'Personalized Growth Journey Design',
                'Music-based Growth Pattern Analysis',
                'Progressive Growth Framework Development'
            ]
        },
        'Modern Life Philosopher': {
            name: 'Jennifer Chen',
            title: 'Modern Life Philosopher',
            image: 'images/person_team_4.png',
            quote: 'Exploring the human condition in modern life',
            education: [
                'UC Berkeley',
                'Department of Philosophy',
                'Ph.D. in Philosophy',
                'Research focus: Modern Life & Human Condition'
            ],
            background: [
                'Modern Life Philosophy & Behavioral Science',
                'Research: Human Condition in Modern Life',
                'Expert in Modern Life Philosophy',
                'Former researcher at UCSF Department of Philosophy'
            ],
            experience: [
                '4,000+ Modern Life Philosophy Cases',
                'Human Condition Analysis in Modern Life',
                'Personal Growth Pattern Analysis',
                'Wisdom-to-Action Framework Development'
            ]
        },
        'Life Principles Specialist': {
            name: 'David Thompson',
            title: 'Life Principles Specialist',
            image: 'images/person_team_5.png',
            quote: 'Applying timeless principles to modern life',
            education: [
                'Brown University',
                'Department of Philosophy',
                'M.S. in Philosophy',
                'Focus: Timeless Principles in Modern Life'
            ],
            background: [
                'Life Principles & Behavioral Science',
                'Research: Timeless Principles in Modern Life',
                'Certified Life Principles Specialist',
                'Former researcher at Yale Department of Philosophy'
            ],
            experience: [
                '2,000+ Life Principles Application Cases',
                'Timeless Principles Application in Modern Life',
                'Personal Growth Pattern Analysis',
                'Wisdom-to-Action Framework Development'
            ]
        }
    };
    
    roles.forEach(role => {
        role.addEventListener('click', function() {
            const roleTitle = this.textContent;
            const data = profileData[roleTitle];
            
            // Update active state
            roles.forEach(r => r.classList.remove('active'));
            this.classList.add('active');
            
            // Update profile content
            document.querySelector('.profile-image').src = data.image;
            document.querySelector('.profile-image').alt = data.name;
            document.querySelector('.quote').textContent = data.quote;
            document.querySelector('.profile-info h2').textContent = data.name;
            document.querySelector('.profile-info .title').textContent = data.title;
            
            // Update lists
            const educationList = document.querySelector('.education ul');
            const backgroundList = document.querySelector('.background ul');
            const experienceList = document.querySelector('.experience ul');
            
            educationList.innerHTML = data.education.map(item => `<li>${item}</li>`).join('');
            backgroundList.innerHTML = data.background.map(item => `<li>${item}</li>`).join('');
            experienceList.innerHTML = data.experience.map(item => `<li>${item}</li>`).join('');
        });
    });
});
