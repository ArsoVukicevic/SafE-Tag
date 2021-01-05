function findSelectedItemInTree(selectedItem, itemsTree) {
  const keys = selectedItem.key.split('/')
  let items = { nodes: itemsTree }
  for (let i = 0; i < keys.length; i++) {
    const temp = keys[i]
    items = items.nodes.find(item => item.key == temp)
  }

  return items
}

function selectParents(selectedItem, itemsTree, itemsForSubmit) {
  const keys = selectedItem.parent.split('/')

  let items = { nodes: itemsTree }
  let parentKeys = ''
  for (let i = 0; i < keys.length; i++) {
    const temp = keys[i]
    items = items.nodes.find(item => item.key == temp)
    if (items !== undefined) {
      items.selected = true
      parentKeys += parentKeys === '' ? temp : '/' + temp
      addRemoveItemForSubmit(itemsForSubmit, parentKeys, true)
    }
  }
}

function selectChildrens(selectedItemInTree, itemsForSubmit, isSelected = true, key) {
  selectedItemInTree.nodes.forEach(item => {
    if (item.nodes.length > 0) {
      key += '/' + item.key
      addRemoveItemForSubmit(itemsForSubmit, key, isSelected)
      selectChildrens(item, itemsForSubmit, isSelected, key)
    } else {
      addRemoveItemForSubmit(itemsForSubmit, key + '/' + item.key, isSelected)
    }

    item.selected = isSelected
  })
}

function addRemoveItemForSubmit(itemsForSubmit, key, add) {
  if (add) {
    !itemsForSubmit.includes(key) && itemsForSubmit.push(key)
  } else {
    var index = itemsForSubmit.indexOf(key)
    if (index !== -1) itemsForSubmit.splice(index, 1)
  }
}

export default function auditItemSeasch(selectedItem, items, itemsForSubmit) {
  const selectedItemInTree = findSelectedItemInTree(selectedItem, items)
  selectedItemInTree.selected = selectedItemInTree.selected === undefined ? true : !selectedItemInTree.selected
  if (selectedItemInTree.selected) {
    addRemoveItemForSubmit(itemsForSubmit, selectedItem.key, true)
    selectParents(selectedItem, items, itemsForSubmit)
    selectChildrens(selectedItemInTree, itemsForSubmit, true, selectedItem.key)
  } else {
    addRemoveItemForSubmit(itemsForSubmit, selectedItem.key, false)
    selectChildrens(selectedItemInTree, itemsForSubmit, false, selectedItem.key)
  }
}
