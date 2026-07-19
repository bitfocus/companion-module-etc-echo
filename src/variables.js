export function UpdateVariableDefinitions(self) {
	const variables = {}

	for (let space = 1; space <= 16; space++) {
		variables[`space${space}_zones`] = { name: `Space ${space} Intensities` }
		variables[`space${space}_off`] = { name: `Space ${space} Off` }
		variables[`space${space}_preset`] = { name: `Space ${space} Active Preset` }
		variables[`space${space}_sequence`] = { name: `Space ${space} Active Sequence` }
	}

	self.setVariableDefinitions(variables)
}
