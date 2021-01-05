import React from 'react'
import Autosuggest from 'react-autosuggest'
import { Input } from 'reactstrap'
import '../assets/css/autocomplite.css'

function getSuggestionValue(suggestion) {
  return suggestion.name
}

function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.name}</span>
  )
}
function shouldRenderSuggestions(value) {
  return value.trim().length >= 0
}
const renderInputComponent = inputProps => <Input {...inputProps} type="text" />

class AutoComplite extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: props.startValue || '',
      suggestions: [],
      datas: props.datas
    }

    this.onChange = (event, { newValue, method }) => {
      this.setState({
        value: newValue
      })
    }

    this.getSuggestions = (value) => {
      const escapedValue = value.toLowerCase()
      if (this.state.datas.findIndex(data => data.name.toLowerCase() === escapedValue) !== -1) {
        return this.state.datas
      }

      return this.state.datas.filter(data => data.name.toLowerCase().includes(escapedValue))
    }

    this.onSuggestionsFetchRequested = ({ value }) => {
      this.setState({
        suggestions: this.getSuggestions(value)
      })
    }

    this.onSuggestionsClearRequested = () => {
      this.setState({
        suggestions: []
      })
    }

    this.onSuggestionSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
      this.props.onSelected(suggestion)
    }

    this.clearValue = () => {
      this.setState({
        value: ''
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.datas !== this.props.datas) {
      this.setState({
        datas: this.props.datas,
        value: ''
      })
    }
  }

  render() {
    const { value, suggestions } = this.state
    const inputProps = {
      id: 'parentId',
      placeholder: 'This is autocomplite start typing...',
      value,
      onChange: this.onChange
    }
    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        shouldRenderSuggestions={shouldRenderSuggestions}
        renderInputComponent={renderInputComponent}
        onSuggestionSelected={this.onSuggestionSelected}
      />
    )
  }
}

export default AutoComplite
