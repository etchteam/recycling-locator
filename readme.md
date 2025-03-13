# Recycling Locator

Powered by RecycleNow.com, this tool can be used to search and find recycling locations throughout the United Kingdom. It’s been created as an embeddable widget that can be added to any website to help visitors discover more recycling options.

## Add the widget to your website

To apply to embed the widget on your website, email us at [PartnerEnquiries@wrap.org.uk](mailto:PartnerEnquiries@wrap.org.uk).

Installation won't work until your application has been approved.

### Option 1: Install the script

Add the script above the closing `</body>` tag.

```html
<script src="https://rl.recyclenow.com/wrap-rlw.js" async defer></script>
```

Include an element with the id "wrap-rlw" into your HTML, this is where the widget will be output.

```html
<div id="wrap-rlw"></div>
```

Include the global stylesheet (optional)

```html
<link href="https://rl.recyclenow.com/recycling-locator.css">
```

### Option 2: Install the web component

Install via NPM

```bash
npm i -S @etchteam/recycling-locator`
```

Include the web component in your HTML, this is where the widget will be output.

```html
<recycling-locator></recycling-locator>
```

Include the stylesheet within your website styles (optional)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@etchteam/recycling-locator@latest/dist/recycling-locator.css">
```

⚠️ Dependabot is configured to notify daily for NPM version changes, falling out of date means the widget could stop working due to upstream breaking API changes.

## Available settings

### Locale

Use the `locale` attribute to set the language.

The language code for Welsh (`cy`) is currently the only supported language code.

**Script**

```html
<script src="..." data-locale="cy"></script>
```

**Web component**

```html
<recycling-locator locale="cy"></recycling-locator>
```

### Theme

Accepted values are red, blue, green, orange, purple, brown, navy, or black.

**Script**

```html
<script src="..." data-theme="red"></script>
```

**Web component**

```html
<recycling-locator theme="red"></recycling-locator>
```

#### CSS variables

For more granular control over the theme, add CSS variables to your stylesheet.

```css
:root{
  /* The primary colour is the main color that's changed via theme presets */
  --recycling-locator-color-primary-lightest: #eef5e5;
  --recycling-locator-color-primary-light: #dfefc8;
  --recycling-locator-color-primary: #8dc63f;
  --recycling-locator-color-primary-dark: #297f00;

  /* Other variables control specific parts of the UI */
  --recycling-locator-theme-background: #fff;
  --recycling-locator-theme-background-muted-light: #f5f6f8;
  --recycling-locator-theme-heading-color-light: #222;
  --recycling-locator-theme-color-light: #222;
  --recycling-locator-theme-color-muted-light: #4f4f4f;
  --recycling-locator-theme-color-hover: var(--recycling-locator-color-primary-dark);
  --recycling-locator-theme-border-color-light: #cfd1d3;
  --recycling-locator-theme-border-color-hover-light: var(--recycling-locator-color-primary-dark);
  --recycling-locator-theme-link-color: var(--recycling-locator-color-primary-dark);
}
```

### Path

The initial path to load. Common examples include:

- `/{postcode}` to pre-fill the location
- `/home-recycling` for home recycling embeds
- `/material?materials=111&search=Cereal boxes` to pre-select a material
- `/{postcode}/places/{placeName}/{placePostcode}` to load a single place

To discover other possible initial path combinations, take note of the path in the URL whilst navigating on the standalone version of the tool at [locator.recyclenow.com](https://locator.recyclenow.com/).

**Script**

```html
<script src="..." data-initial-path="/home-recycling"></script>
```

**Web component**

```html
<recycling-locator path="/home-recycling"></recycling-locator>
```

### Materials

This setting is **only available for the script installation method** for backwards compatibility.

The same can be achieved by passing materials in the `path` web component attribute.

Example with material id:

```html
<script src="..." data-materials="1"></script>
```

Example with multiple materials:

```html
<script src="..." data-materials="[1,2]"></script>
```

<details>
  <summary>View the list of available material IDs</summary>
  <table>
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Name (cy)</th>
    </tr>
    <tr>
      <td>1</td>
      <td>Cardboard egg boxes</td>
      <td>Bocs cardfwrdd ar gyfer wyau</td>
    </tr>
    <tr>
      <td>2</td>
      <td>Cardboard fruit and veg punnets</td>
      <td>Basgedi cardfwrdd ar gyfer ffrwythau a llysiau</td>
    </tr>
    <tr>
      <td>3</td>
      <td>Cardboard sleeves</td>
      <td>Cloriau cardfwrdd</td>
    </tr>
    <tr>
      <td>4</td>
      <td>Cereal boxes</td>
      <td>Bocsys grawnfwyd</td>
    </tr>
    <tr>
      <td>5</td>
      <td>Corrugated cardboard</td>
      <td>Cardfwrdd gwrymiog</td>
    </tr>
    <tr>
      <td>6</td>
      <td>Food and drink cartons</td>
      <td>Cartonau bwyd a diodydd</td>
    </tr>
    <tr>
      <td>7</td>
      <td>Toilet roll tubes</td>
      <td>Rholiau papur tŷ bach</td>
    </tr>
    <tr>
      <td>8</td>
      <td>Greeting cards</td>
      <td>Cardiau cyfarch</td>
    </tr>
    <tr>
      <td>9</td>
      <td>Brown envelopes</td>
      <td>Amlenni brown</td>
    </tr>
    <tr>
      <td>10</td>
      <td>Junk mail</td>
      <td>Llythyrau sgrwtsh</td>
    </tr>
    <tr>
      <td>11</td>
      <td>Magazines</td>
      <td>Cylchgronau</td>
    </tr>
    <tr>
      <td>12</td>
      <td>Newspapers</td>
      <td>Papurau newydd</td>
    </tr>
    <tr>
      <td>13</td>
      <td>Shredded paper</td>
      <td>Papur wedi’i falu</td>
    </tr>
    <tr>
      <td>14</td>
      <td>Telephone directories</td>
      <td>Cyfeirlyfr ffôn</td>
    </tr>
    <tr>
      <td>15</td>
      <td>Window envelopes</td>
      <td>Amlenni ffenestr</td>
    </tr>
    <tr>
      <td>16</td>
      <td>Yellow Pages</td>
      <td>Tudalennau melyn</td>
    </tr>
    <tr>
      <td>17</td>
      <td>Books</td>
      <td>Llyfrau</td>
    </tr>
    <tr>
      <td>18</td>
      <td>Aluminium foil</td>
      <td>Papur alwminiwm</td>
    </tr>
    <tr>
      <td>19</td>
      <td>Foil trays</td>
      <td>Hambyrddau papur arian</td>
    </tr>
    <tr>
      <td>20</td>
      <td>Glass bottles and jars</td>
      <td>Poteli a jariau gwydr</td>
    </tr>
    <tr>
      <td>21</td>
      <td>Ovenware (pyrex)</td>
      <td>Llestri popty (pyrex)</td>
    </tr>
    <tr>
      <td>22</td>
      <td>Window glass</td>
      <td>Gwydr ffenestri</td>
    </tr>
    <tr>
      <td>23</td>
      <td>Aerosols</td>
      <td>Erosolau</td>
    </tr>
    <tr>
      <td>24</td>
      <td>Drinks cans</td>
      <td>Caniau diodydd</td>
    </tr>
    <tr>
      <td>25</td>
      <td>Food tins</td>
      <td>Tuniau bwyd</td>
    </tr>
    <tr>
      <td>26</td>
      <td>Metal lids from glass jars</td>
      <td>Caeadau metel jariau gwydr</td>
    </tr>
    <tr>
      <td>27</td>
      <td>Scrap metal</td>
      <td>Metel sgrap</td>
    </tr>
    <tr>
      <td>28</td>
      <td>Batteries</td>
      <td>Batrïau</td>
    </tr>
    <tr>
      <td>29</td>
      <td>Bicycles</td>
      <td>Beiciau</td>
    </tr>
    <tr>
      <td>30</td>
      <td>Cork</td>
      <td>Corcyn</td>
    </tr>
    <tr>
      <td>31</td>
      <td>Spectacles</td>
      <td>Sbectol</td>
    </tr>
    <tr>
      <td>32</td>
      <td>Stamps</td>
      <td>Stampiau</td>
    </tr>
    <tr>
      <td>33</td>
      <td>Upholstered furniture</td>
      <td>Dodrefn wedi eu clustogi</td>
    </tr>
    <tr>
      <td>34</td>
      <td>Non-upholstered furniture</td>
      <td>Dodrefn heb eu clustogi</td>
    </tr>
    <tr>
      <td>35</td>
      <td>Bric-a-brac</td>
      <td>Mân drugareddau</td>
    </tr>
    <tr>
      <td>36</td>
      <td>Non-electric toys &amp; games</td>
      <td>Tegannau a gemau anelectronig</td>
    </tr>
    <tr>
      <td>37</td>
      <td>Toner &amp; printer cartridges</td>
      <td>Cetris peiriant argraffu</td>
    </tr>
    <tr>
      <td>38</td>
      <td>Ceramics</td>
      <td>Llestri</td>
    </tr>
    <tr>
      <td>39</td>
      <td>Water filters</td>
      <td>Hidlydd dŵr</td>
    </tr>
    <tr>
      <td>40</td>
      <td>Prams &amp; pushchairs</td>
      <td>Pramiau a choetsys cadair</td>
    </tr>
    <tr>
      <td>41</td>
      <td>Records, CDs &amp; DVDs</td>
      <td>Recordiau, CD a DVD</td>
    </tr>
    <tr>
      <td>42</td>
      <td>Household cleaner &amp; detergent bottles</td>
      <td>Poteli hylifau glanhau</td>
    </tr>
    <tr>
      <td>43</td>
      <td>Plastic milk bottles</td>
      <td>Poteli llaeth</td>
    </tr>
    <tr>
      <td>44</td>
      <td>Plastic drinks bottles</td>
      <td>Poteli diodydd</td>
    </tr>
    <tr>
      <td>45</td>
      <td>Toiletries &amp; shampoo bottles</td>
      <td>Poteli sebon a siampŵ</td>
    </tr>
    <tr>
      <td>46</td>
      <td>Plastic carrier bags</td>
      <td>Bagiau siopa</td>
    </tr>
    <tr>
      <td>47</td>
      <td>Food pots &amp; tubs</td>
      <td>Potiau a thybiau bwyd</td>
    </tr>
    <tr>
      <td>48</td>
      <td>Margarine tubs</td>
      <td>Tybiau margarin</td>
    </tr>
    <tr>
      <td>49</td>
      <td>Plant pots</td>
      <td>Potiau planhigion</td>
    </tr>
    <tr>
      <td>50</td>
      <td>Plastic trays</td>
      <td>Hambyrddau plastig</td>
    </tr>
    <tr>
      <td>51</td>
      <td>Yoghurt pots</td>
      <td>Potiau iogwrt</td>
    </tr>
    <tr>
      <td>52</td>
      <td>Clothing</td>
      <td>Dillad</td>
    </tr>
    <tr>
      <td>53</td>
      <td>Household linens</td>
      <td>Llieiniau’r cartref</td>
    </tr>
    <tr>
      <td>54</td>
      <td>Shoes &amp; bags</td>
      <td>Esgidiau a bagiau</td>
    </tr>
    <tr>
      <td>55</td>
      <td>Fridge &amp; freezers</td>
      <td>Oergelloedd a rhewgelloedd</td>
    </tr>
    <tr>
      <td>56</td>
      <td>Electric cookers &amp; ovens</td>
      <td>Poptai trydan</td>
    </tr>
    <tr>
      <td>57</td>
      <td>Washing machines &amp; dryers</td>
      <td>Peiriannau golchi a sychu</td>
    </tr>
    <tr>
      <td>58</td>
      <td>Laptops</td>
      <td>Cliniaduron</td>
    </tr>
    <tr>
      <td>59</td>
      <td>Computers</td>
      <td>Cyfrifiaduron</td>
    </tr>
    <tr>
      <td>60</td>
      <td>TVs</td>
      <td>Setiau teledu</td>
    </tr>
    <tr>
      <td>61</td>
      <td>DVD/CD players</td>
      <td>Chwaraewyr DVD/CD</td>
    </tr>
    <tr>
      <td>62</td>
      <td>Hi-fi</td>
      <td>Hi-fi</td>
    </tr>
    <tr>
      <td>63</td>
      <td>Telephones/fax</td>
      <td>Teleffonau/ffacs</td>
    </tr>
    <tr>
      <td>64</td>
      <td>Mobile phones</td>
      <td>Ffonau poced</td>
    </tr>
    <tr>
      <td>65</td>
      <td>Cameras</td>
      <td>Camerâu</td>
    </tr>
    <tr>
      <td>66</td>
      <td>Toasters, kettles, &amp; vacuums</td>
      <td>Peiriant tostio, tegell, sugnwr llwch</td>
    </tr>
    <tr>
      <td>67</td>
      <td>Hairdryers &amp; electric toothbrushes</td>
      <td>Sychwr gwallt, brws dannedd trydan</td>
    </tr>
    <tr>
      <td>68</td>
      <td>Electrical home &amp; garden tools</td>
      <td>Offer trydan i’r cartref a’r ardd</td>
    </tr>
    <tr>
      <td>69</td>
      <td>Electronic toys &amp; games</td>
      <td>Tegannau a gemau electronig</td>
    </tr>
    <tr>
      <td>70</td>
      <td>Energy-saving light bulbs</td>
      <td>Bylbiau arbed ynni</td>
    </tr>
    <tr>
      <td>71</td>
      <td>Microwave</td>
      <td>Microdon</td>
    </tr>
    <tr>
      <td>72</td>
      <td>Table lamps</td>
      <td>Llampiau bwrdd</td>
    </tr>
    <tr>
      <td>73</td>
      <td>Kitchen oils</td>
      <td>Olew coginio</td>
    </tr>
    <tr>
      <td>74</td>
      <td>Cleaning fluids</td>
      <td>Hylif glanhau</td>
    </tr>
    <tr>
      <td>75</td>
      <td>Paint, varnish</td>
      <td>Paent, farnais</td>
    </tr>
    <tr>
      <td>76</td>
      <td>Paint (for reuse)</td>
      <td>Paent (i’w ailddefnyddio)</td>
    </tr>
    <tr>
      <td>77</td>
      <td>Gas bottles</td>
      <td>Poteli nwy</td>
    </tr>
    <tr>
      <td>78</td>
      <td>Tyres</td>
      <td>Teiars</td>
    </tr>
    <tr>
      <td>79</td>
      <td>Car batteries</td>
      <td>Batrïau ceir</td>
    </tr>
    <tr>
      <td>80</td>
      <td>Engine oil</td>
      <td>Olew peiriant</td>
    </tr>
    <tr>
      <td>81</td>
      <td>Bricks, rubble &amp; concrete</td>
      <td>Briciau, rwbel, concrit</td>
    </tr>
    <tr>
      <td>82</td>
      <td>Soil</td>
      <td>Pridd</td>
    </tr>
    <tr>
      <td>83</td>
      <td>Asbestos</td>
      <td>Asbestos</td>
    </tr>
    <tr>
      <td>84</td>
      <td>Doors, beams, fireplaces</td>
      <td>Drysau, trawstiau, llefydd tân</td>
    </tr>
    <tr>
      <td>85</td>
      <td>Scrap wood</td>
      <td>Coed sgrap</td>
    </tr>
    <tr>
      <td>86</td>
      <td>Flowers</td>
      <td>Blodau</td>
    </tr>
    <tr>
      <td>87</td>
      <td>Grass cuttings</td>
      <td>Torion gwair</td>
    </tr>
    <tr>
      <td>88</td>
      <td>Leaves</td>
      <td>Dail</td>
    </tr>
    <tr>
      <td>89</td>
      <td>Plants</td>
      <td>Planhigion</td>
    </tr>
    <tr>
      <td>90</td>
      <td>Prunings &amp; twigs</td>
      <td>Brigiau a thorion llwyni</td>
    </tr>
    <tr>
      <td>91</td>
      <td>Weeds</td>
      <td>Chwyn</td>
    </tr>
    <tr>
      <td>92</td>
      <td>Christmas trees</td>
      <td>Coed Nadolig</td>
    </tr>
    <tr>
      <td>93</td>
      <td>Bread</td>
      <td>Bara</td>
    </tr>
    <tr>
      <td>94</td>
      <td>Cakes &amp; pastries</td>
      <td>Teisennau, cacennau</td>
    </tr>
    <tr>
      <td>95</td>
      <td>Dairy products - eggs, cheese &amp; milk</td>
      <td>Cynnyrch llaeth – wyau, caws, llaeth</td>
    </tr>
    <tr>
      <td>96</td>
      <td>Raw &amp; cooked meat including bones</td>
      <td>Cig amrwd neu wedi’i goginio, gan gynnwys esgyrn</td>
    </tr>
    <tr>
      <td>97</td>
      <td>Raw &amp; cooked fish including bones</td>
      <td>Pysgod amrwd neu wedi’u coginio, gan gynnwys esgyrn</td>
    </tr>
    <tr>
      <td>98</td>
      <td>Raw &amp; cooked vegetables including peelings</td>
      <td>Llysiau amrwd neu wedi’u coginio, gan gynnwys plicion</td>
    </tr>
    <tr>
      <td>99</td>
      <td>Rice</td>
      <td>Reis</td>
    </tr>
    <tr>
      <td>100</td>
      <td>Pasta</td>
      <td>Pasta</td>
    </tr>
    <tr>
      <td>101</td>
      <td>Beans &amp; pulses</td>
      <td>Ffa a chodlysiau</td>
    </tr>
    <tr>
      <td>102</td>
      <td>Uneaten food &amp; plate scrapings</td>
      <td>Bwyd heb ei fwyta a chrafion platiau</td>
    </tr>
    <tr>
      <td>103</td>
      <td>Tea leaves, tea bags &amp; coffee grinds</td>
      <td>Dail te, cydau te a gwaddod coffi</td>
    </tr>
    <tr>
      <td>104</td>
      <td>Uneaten food without packaging</td>
      <td>Bwyd heb ei fwyta heb becynnu</td>
    </tr>
    <tr>
      <td>105</td>
      <td>Paper cups</td>
      <td>Cwpanau papur</td>
    </tr>
    <tr>
      <td>106</td>
      <td>Set top boxes</td>
      <td>Blychau-pen-set</td>
    </tr>
    <tr>
      <td>107</td>
      <td>Routers</td>
      <td>Llwybryddion</td>
    </tr>
    <tr>
      <td>108</td>
      <td>Coffee cups</td>
      <td>cwpanau coffi</td>
    </tr>
    <tr>
      <td>109</td>
      <td>Bread bags</td>
      <td>Bagiau bara plastig</td>
    </tr>
    <tr>
      <td>110</td>
      <td>Glue sticks</td>
      <td>Glue sticks</td>
    </tr>
    <tr>
      <td>111</td>
      <td>Expanded polystyrene</td>
      <td>Polystyren ehangedig</td>
    </tr>
    <tr>
      <td>112</td>
      <td>Frozen food bags</td>
      <td>Bagiau bwydydd o’r rhewgell</td>
    </tr>
    <tr>
      <td>113</td>
      <td>Cereal liners</td>
      <td>Bagiau leinio grawnfwyd</td>
    </tr>
    <tr>
      <td>114</td>
      <td>Delivery bags</td>
      <td>Bagiau danfon nwyddau drwy’r post</td>
    </tr>
    <tr>
      <td>115</td>
      <td>Multi-pack wrapping</td>
      <td>Deunydd lapio pecynnau aml-becyn</td>
    </tr>
    <tr>
      <td>116</td>
      <td>Salad, pasta, and rice bags</td>
      <td>Bagiau salad, pasta a reis</td>
    </tr>
    <tr>
      <td>117</td>
      <td>Cheese, fish and meat wrapping</td>
      <td>Deunydd lapio caws, pysgod a chig</td>
    </tr>
    <tr>
      <td>118</td>
      <td>Crisp packets and sweet bags</td>
      <td>Pecynnau creision a bagiau losin</td>
    </tr>
    <tr>
      <td>119</td>
      <td>Biscuit and chocolate wrappers</td>
      <td>Deunydd lapio bisgedi a siocled</td>
    </tr>
    <tr>
      <td>120</td>
      <td>Baby, pet food, detergent and cleaning pouches</td>
      <td>Pecynnau meddal bwydydd babanod, anifeiliaid anwes, glanhawyr a nwyddau glanhau</td>
    </tr>
    <tr>
      <td>121</td>
      <td>Plastic film lids</td>
      <td>Caeadau haenen blastig</td>
    </tr>
    <tr>
      <td>122</td>
      <td>Toilet roll wrapping</td>
      <td>Bagiau papur toiled</td>
    </tr>
    <tr>
      <td>123</td>
      <td>Plastic lipstick or lip balm tubes</td>
      <td>Tiwbiau minlliw neu balm gwefusau</td>
    </tr>
    <tr>
      <td>124</td>
      <td>Plastic eyeliner or concealer pen</td>
      <td>Pen llinellu llygaid neu golur cuddio</td>
    </tr>
    <tr>
      <td>125</td>
      <td>Plastic concealer or eye shadow tubes (inc applicator)</td>
      <td>Tiwbiau colur cuddio neu golur llygaid (yn cynnwys y ffon)</td>
    </tr>
    <tr>
      <td>126</td>
      <td>Plastic mascara tubes (inc brush, wand)</td>
      <td>Tiwbiau masgara plastig (yn cynnwys y brwsh/ffon)</td>
    </tr>
    <tr>
      <td>127</td>
      <td>Eyeshadow &amp; brow palettes &amp; compacts</td>
      <td>Casys powdr colur llygaid ac aeliau</td>
    </tr>
    <tr>
      <td>128</td>
      <td>Plastic make-up tubes</td>
      <td>Tiwbiau plastig sy’n dal colur</td>
    </tr>
    <tr>
      <td>129</td>
      <td>Plastic lip balm pots</td>
      <td>Potiau plastig sy’n dal balm gwefusau</td>
    </tr>
    <tr>
      <td>130</td>
      <td>Plastic body, hair and face cream pot and tubes</td>
      <td>Tybiau a phostiau plastig sy’n dal hylif corff, cynnyrch gwallt neu eli wyneb</td>
    </tr>
    <tr>
      <td>131</td>
      <td>Plastic body lotion, hand cream and sunscreen tubes</td>
      <td>Tiwbiau plastig sy’n dal hylif corff, eli dwylo neu eli haul</td>
    </tr>
    <tr>
      <td>132</td>
      <td>Plastic refill pouches</td>
      <td>Pecynnau plastig meddal ar gyfer ail-lenwi poteli ac ati</td>
    </tr>
    <tr>
      <td>133</td>
      <td>Plastic sachets, samples and hotel bottle minis</td>
      <td>Pecynnau plastig bychain ar gyfer samplau, poteli mini a geir mewn gwestai</td>
    </tr>
    <tr>
      <td>134</td>
      <td>Plastic dropper bottles</td>
      <td>Poteli diferydd plastig</td>
    </tr>
    <tr>
      <td>135</td>
      <td>Plastic roll-on and stick deodorants</td>
      <td>Pecynnau diaroglydd rholiwr neu flocyn diaroglydd plastig</td>
    </tr>
    <tr>
      <td>136</td>
      <td>Plastic combs</td>
      <td>Cribau plastig</td>
    </tr>
    <tr>
      <td>137</td>
      <td>Plastic contact lens cases</td>
      <td>Casys lensys cyffwrdd plastig</td>
    </tr>
    <tr>
      <td>138</td>
      <td>Plastic toothpaste tubes</td>
      <td>Tiwbiau past dannedd plastig</td>
    </tr>
    <tr>
      <td>139</td>
      <td>Face and hair mask packaging (single use)</td>
      <td>Deunyddiau pacio masg wyneb a gwallt (rhai untro)</td>
    </tr>
    <tr>
      <td>140</td>
      <td>Wipes packets</td>
      <td>Pecynnau weips</td>
    </tr>
    <tr>
      <td>141</td>
      <td>Toothbrushes or electronic toothbrush heads</td>
      <td>Brwshys dannedd neu bennau brwshys dannedd electronig</td>
    </tr>
    <tr>
      <td>142</td>
      <td>Walking aids</td>
      <td>Cymhorthion cerdded</td>
    </tr>
    <tr>
      <td>143</td>
      <td>Absorbent hygiene products (AHP)</td>
      <td>Cynnyrch hylendid amsugnol (AHP)</td>
    </tr>
    <tr>
      <td>144</td>
      <td>Vapes/e-cigarettes</td>
      <td>vapes/e-sigarennau</td>
    </tr>
    <tr>
      <td>145</td>
      <td>Coffee pods</td>
      <td>Podiau coffi</td>
    </tr>
    <tr>
      <td>146</td>
      <td>Asbestos</td>
      <td>Asbestos</td>
    </tr>
  </table>
</details>

### Public path

This setting is **only available for the web component installation method**.

This setting can be used to set a public URL to load assets from, the path should always end with a `/`.

If not provided, [jsdelivr CDN](https://www.jsdelivr.com/) will be used.

The following example would serve assets from your websites public directory:

```html
<recycling-locator public-path="/public/"></recycling-locator>
```

To self-host assets, static files can be moved from node_modules using a postinstall script.

```bash
cp -r ./node_modules/@etchteam/recycling-locator/dist/images ./public
cp -r ./node_modules/@etchteam/recycling-locator/dist/translations ./public
cp ./node_modules/@etchteam/recycling-locator/dist/recycling-locator.css ./public
cp ./node_modules/@etchteam/recycling-locator/dist/styles.css ./public
```

## Content Security Policy (CSP)

If your website implements a CSP, it'll need some changes based on whether the script or web component installation option is being used.

**Script**

- `img-src data: https://rl.recyclenow.com https://*.here.com;`
- `script-src https://rl.recyclenow.com 'unsafe-eval';`
- `connect-src blob: https://rl.recyclenow.com https://*.sentry.io https://*.hereapi.com https://*.here.com;`
- `style-src 'unsafe-inline' https://rl.recyclenow.com;`
- `font-src https://*.here.com;`
- `worker-src blob:;`

**Web component**

- `img-src data: https://cdn.jsdelivr.net https://*.here.com;`
- `script-src 'self' 'unsafe-eval';`
- `connect-src blob: https://cdn.jsdelivr.net https://rl.recyclenow.com https://*.sentry.io https://*.hereapi.com https://*.here.com;`
- `style-src 'unsafe-inline' https://cdn.jsdelivr.net;`
- `font-src https://*.here.com;`
- `worker-src blob:;`

## Listening for when the locator has loaded

The `<recycling-locator>` will dispatch a custom "ready" event when the UI has rendered.

```javascript
document
  .querySelector('recycling-locator')
  .addEventListener('ready', () => {
    console.info('Ready to recycle');
  });
```

## Contributing

Looking to contribute to the code? A good starting point is [the contributing docs](https://github.com/etchteam/recycling-locator-widget/blob/main/contributing.md).
