document.addEventListener('DOMContentLoaded', () => {
	const grid = document.getElementById('launcher-grid')
	const errorMessage = document.getElementById('error-message')
	let tiles = []
	let focusedIndex = 0

	const showError = message => {
		errorMessage.textContent = message
		errorMessage.classList.add('visible')
		setTimeout(() => errorMessage.classList.remove('visible'), 3000)
	}

	const getItemsInRow = () => {
		if (tiles.length === 0) return 0
		const containerWidth = grid.clientWidth
		if (containerWidth === 0) return 1
		const tileWidth = tiles[0].offsetWidth
		const tileGap = parseInt(getComputedStyle(grid).gap)
		return Math.floor(containerWidth / (tileWidth + tileGap)) || 1
	}

	const setupLauncher = async () => {
		grid.innerHTML = ''
		try {
			const response = await fetch('../config.json', { cache: 'no-store' })
			if (!response.ok)
				throw new Error(`HTTP error! status: ${response.status}`)
			const config = await response.json()

			if (config.theme) {
				const root = document.documentElement
				root.style.setProperty(
					'--background-color',
					config.theme.background || '#141414'
				)
				root.style.setProperty('--text-color', config.theme.text || '#f5f5f5')
				root.style.setProperty(
					'--tile-focus-color',
					config.theme.focusBorder || '#ffffff'
				)
			}

			if (config.tiles && config.tiles.length > 0) {
				config.tiles.forEach(item => {
					const tile = document.createElement('div')
					tile.className = 'tile'
					tile.style.backgroundImage = `url(../${item.icon})`
					tile.dataset.action = item.action

					const name = document.createElement('span')
					name.className = 'tile-name'
					name.textContent = item.name

					tile.appendChild(name)
					grid.appendChild(tile)
				})
			}

			tiles = Array.from(document.querySelectorAll('.tile'))
			if (tiles.length > 0) {
				focusedIndex = 0
				tiles[focusedIndex].classList.add('focused')
			} else {
				showError('Нет плиток для отображения. Проверьте config.json')
			}
		} catch (error) {
			console.error('Failed to load config.json:', error)
			showError(`Ошибка загрузки config.json: ${error.message}`)
		}
	}

	document.addEventListener('keydown', async e => {
		if (tiles.length === 0) return

		let itemsInRow = getItemsInRow()
		tiles[focusedIndex].classList.remove('focused')

		switch (e.key) {
			case 'ArrowRight':
				focusedIndex = (focusedIndex + 1) % tiles.length
				break
			case 'ArrowLeft':
				focusedIndex = (focusedIndex - 1 + tiles.length) % tiles.length
				break
			case 'ArrowDown':
				focusedIndex = Math.min(focusedIndex + itemsInRow, tiles.length - 1)
				break
			case 'ArrowUp':
				focusedIndex = Math.max(focusedIndex - itemsInRow, 0)
				break
			case 'Enter':
				const action = tiles[focusedIndex].dataset.action
				const result = await window.api.runAction(action)
				if (!result.success) {
					showError(`Не удалось выполнить: ${action}. Ошибка: ${result.error}`)
				}
				break
			default:
				tiles[focusedIndex].classList.add('focused')
				return
		}

		tiles[focusedIndex].classList.add('focused')
		tiles[focusedIndex].scrollIntoView({
			behavior: 'smooth',
			block: 'center',
			inline: 'center',
		})
	})

	// Первоначальная настройка
	setupLauncher()

	// Слушаем сигнал от main процесса для горячей перезагрузки
	window.api.onConfigChange(() => {
		console.log('Received config-changed signal. Re-rendering launcher.')
		setupLauncher()
	})
})
