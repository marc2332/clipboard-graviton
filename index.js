

function EnvOutlined({ element, style }) {
	const styleWrapper = style`
		& *{
			stroke: var(--iconFill);
		}
	`
	
	return element`
		<svg class="${styleWrapper}" width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M5.8 5.8C5.8 5.16196 5.8 4.55446 5.8 3.9994C5.8 2.34254 7.14315 1 8.8 1H21.9684C23.6427 1 25 2.43269 25 4.2V17.2C25 18.8569 23.6569 20.2 22 20.2H20.2V8.8C20.2 7.14315 18.8568 5.8 17.2 5.8H5.8Z" stroke-width="2"/>
			<rect x="1" y="5.8" width="19.2" height="19.2" rx="3" stroke-width="2"/>
		</svg>
	`
}

function entry({ puffin, SidePanel, Explorer, RunningConfig, ContextMenu }){
	
	const state = new puffin.state({})
	
	new SidePanel({
		icon(){
			return EnvOutlined(puffin)
		},
		panel(){
			return new Explorer({
				items:[
					{
						label: 'Clipboard',
						items:[],
						contextAction(event, { setItems }){
							new ContextMenu({
								list:[
									{
										label: 'Clear',
										action(){
											state.emit('cleared')
										}
									}
								],
								parent: document.body,
								event
							})
						},
						mounted({ setItems }){
							let items = []
							RunningConfig.on('clipboardHasBeenWritten',({ text }) => {
								const copyDate = new Date()
								const copyName = text.split('\n')
								items = [
									{
										decorator:{
											label: `${copyDate.getHours()}:${copyDate.getMinutes()}:${copyDate.getSeconds()}`
										},
										label: `${copyName[0]} ${copyName.length > 1 ? '...' : ''}`,
										action(){
											RunningConfig.emit('writeToClipboardSilently', text)
										}
									},
									...items
								]
								setItems(items)
							})
							state.once('cleared', () => {
								items = []
								setItems(items)
							})
						}
					}
				]
			})
		}
	})
}

module.exports = {
	entry
}