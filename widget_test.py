## Test: Create interactive UI in notebook for annotating data ##

# CELL 1
import ipywidgets as widgets
from IPython.display import display

aspects = ['gameplay','music','performance']

def create_Aspect_widget():
    aspects_widget = widgets.Dropdown(
        options=aspects,
        description='Aspect:',
        disabled=False,
    )
    
    polarityLabel_widget = widgets.Dropdown(
        options=['positive', 'negative'],
        value='positive',
        description='Label:',
    )
    
    ordinal_widget = widgets.Dropdown(
        options=['0', '1', '2', '3', '4', '5'],
        value='0',
        description='Ordinal',
    )
    
    return widgets.HBox([aspects_widget, polarityLabel_widget, ordinal_widget])

# CELL 2
for idx, row in final_sample.iterrows():
    review_text = row['review']
    print(review_text)
    finished = False

    confirm_button = widgets.Button(
        description='Finish',
        disabled=False,
        button_style='warning' # 'success', 'info', 'warning', 'danger' or ''
    )
    
    def submit_labelled_review(arg):
        finished = True
        print('pressed')
        
    confirm_button.on_click(submit_labelled_review)
    
    add_aspect_button = widgets.Button(
        description='Add aspect',
        disabled=False,
        button_style='success'
    )
    
    items = [widgets.HBox([confirm_button, add_aspect_button])]
    container = widgets.VBox(items)
    def add_aspect(arg):
        items.append(create_aspect_widget())
        container = widgets.VBox(items)
        
    add_aspect_button.on_click(add_aspect)

    while not finished:
        pass

# CELL 3
from IPython.display import display
import ipywidgets as widgets

out = widgets.Output()

import asyncio
def wait_for_change(widget, value):
    future = asyncio.Future()
    def getvalue(change):
        # make the new value available
        future.set_result(change.new)
        widget.unobserve(getvalue, value)
    widget.observe(getvalue, value)
    return future



from ipywidgets import IntSlider
slider = IntSlider()

# Now the key: the container is displayed (while empty) in the main thread
async def f():
    for i in range(10):
        out.append_stdout('did work %s'%i)
        x = await wait_for_change(slider, 'value')
        out.append_stdout('async function continued with value %s'%x)
asyncio.ensure_future(f())

display(slider)
display(out)