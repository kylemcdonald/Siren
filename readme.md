# Siren

"Siren" (2021) by Annie Lewandowski and Kyle McDonald, with scenic designer Amy Rubin.

"In Siren – Listening to Another Species on Earth, composer and performer Annie Lewandowski, artist and coder Kyle McDonald, and scenic designer Amy Rubin explore humpback whale song in a meeting of intelligences – humpback whale, human, and artificial. Their visually and sonically immersive piece reveals the wounded flourishing of the humpback whale, a species who continues to sing even as the menace of entanglement threatens its very existence. Siren celebrates the beauty and conservation legacy of the multi-platinum record Songs of the Humpback Whale on its 50th anniversary, while providing a window into the creative minds of our ancient mammalian relative in a contemporary experience of its ever-evolving song."

This repository includes the code for producing the lighting design for the installation.

## Python

### File structure

`python/data/` should contain:

- `.wav` files that Annie recorded off Hawaiʻi island
- `*.Table.1.selections.txt` annotations exported from Raven
- `.als` file of Annie's composition

There is also an `phrases.csv` file that describes which phrase is matched to each unit for `022619_Solo with Shrimp_Bass_mcq_02-28-20`. But this was replaced by the `theme_to_units` mapping in `siren.py` because, except for some ambiguous passages, all the units have a one-to-one mapping to themes for this song.

### Install

After installing Anaconda:

```
conda create -n siren python=3.9
conda activate siren
git clone https://github.com/kylemcdonald/python-utils.git utils
conda install -y umap-learn jupyterlab ffmpeg-python pillow opencv matplotlib pandas librosa
```

I was also testing the Rapids implementation of UMAP:

```
conda create -n rapids-21.06 -c rapidsai -c nvidia -c conda-forge \
    cuml=21.06 python=3.7 cudatoolkit=11.2 -y
```

### Running

1. Run `Combine All Data.ipynb` to produce the per-file lighting design (skip to "jump to this cell" if cached data is available).
2. Run `Parse Ableton.ipynb` to combine all the per-file lighting designs into one larger lighting design.

To edit the lighting design, change `get_lighting()` in `Combine All Data.ipynb` then re-run the last cell and re-run `Parse Ableton.ipynb`.

### Updating for a new lighting configuration

1. Update `python/settings.json` with the correct fixture totals and re-run the notebooks.
2. Update the Super Sweet to have the correct number of output channels (in "Mapping" settings).
3. Change `udpsend.js` to specify the correct number of total channels.
4. Change `expand.js` to match RGB colors to the correct mapping for the fixtures.
5. Change `combine-colors.js` to specify the total inner and outer fixtures.

### Fixture notes

#### Invisible Dog

- 12x local lights
- 8x global lights

#### Mass MoCA

- 20x CubeECHO: red, green, blue, white, amber, uv
- 6x ETC Selador Vivid R 11 inch: red, red-orange, amber, green, cyan, blue, uv, dimmer

## Max

- `DMXUSBPro.maxpat` custom modifications to a patch from [here](https://github.com/thomasfredericks/DMX_USB_PRO_MAX).
- `max-for-live.amxd` is the main patch for playing back the lighting design. Drop it into a track in the Ableton set, press the `script start` messagebox to start the Node for Max script, then button to load the lighting design, and the checkbox to start the metro. The lighting design is loaded from an adjacent `design.json` file.
- Javascript for the Max for Live patch:
    - `lighting-reader.js` Node for Max script that loads the `design.json` and handles playback. Does not do any interpolation, so if it is possible to get higher framerates than the 60fps of the exported file, this is not accounted for.
    - `deinterleave.js` converts 6-channel DMX colors to a multi-plane format that is appropriate for a Jitter matrix.
    - `lowpass.js` for "blurring" the lighting output in a way that peaks reset the lighting, then slowly fade out.
- `random-lights.py` example of sending DMX over serial using Python. Useful for testing that the DMX device works.

### Max controls

- b_out: overall brightness of outer lights
- w_out: minimum white level for all lights