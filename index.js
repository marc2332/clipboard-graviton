function entry({ puffin, SidePanel, Explorer, RunningConfig, ContextMenu }){
	
	const state = new puffin.state({})
	
	new SidePanel({
		icon(){
			return puffin.element`<b>test</b>`
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