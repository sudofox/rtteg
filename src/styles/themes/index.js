import light from './_lightMuiTheme'
import dark from './_darkMuiTheme'

const themes = {
    light,
    dark
}

export default function getTheme(theme) {
    return themes[theme]
}