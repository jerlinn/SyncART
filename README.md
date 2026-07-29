# LunaWake website

Link：https://jerlinn.github.io/SyncART/

This repository contains the public LunaWake website and its tracked launch assets.

## Project Overview

Do not use historical website copy, Coach/Dawn demos, audio test fixtures, or legacy CSS as product requirements. The current product definition lives in the `Lunawake-wiki` repository:

- `wiki/summaries/device-interaction-spec.md`
- `wiki/summaries/state-machine-spec.md`
- `refs/01-capability/firmware.md`
- `refs/Lunawake-用户旅程与设备反应.md`

Key boundary: the microphones provide passive acoustic sensing only. LunaWake does not provide voice commands, text-to-speech, or conversation. The Luna App is the configuration and presentation layer; physical device controls remain authoritative.

Raw source image and video libraries are kept locally under ignored paths and are not deployment assets. Any page reference to those files must be replaced with a tracked, deployable asset before publishing.

## Features

- Responsive design for all devices
- Mobile-first approach
- Interactive FAQ system
- Support ticket system
- Region selector functionality
