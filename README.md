# react-native-stories-plus

<p align="center">
<img src="./example/example.gif" height="500" />
</p>

## Install

#### 1. Step

```javascript
npm install react-native-stories-plus --save
```

or

```javascript
yarn add react-native-stories-plus
```

#### 2. Step

```javascript
cd ios && pod install
```

## Import

```javascript
import Story from "react-native-stories-plus";
```

## Props

| Name                   | Description                                         | Type      | Default Value |
| :--------------------- | :-------------------------------------------------- | :-------- | :-----------: |
| data                   | Array of IUserStory. You can check from interfaces. | object    |               |
| unPressedBorderColor   | Unpressed border color of profile circle            | color     |      red      |
| pressedBorderColor     | Pressed border color of profile circle              | color     |     grey      |
| onClose                | callback when close                                 | function  |     null      |
| onStart                | callback when start                                 | function  |     null      |
| onLikePress            | callback when liked                                 | function  |     null      |
| onCartPress            | callback when added to cart                         | function  |     null      |
| onSharePress           | callback when shared                                | function  |     null      |
| duration               | Per story duration seconds                          | number    |      10       |
| swipeText              | Text of swipe component                             | string    |   Swipe Up    |
| customSwipeUpComponent | For use custom component for swipe area             | component |               |
| customCloseComponent   | For use custom component for close button           | component |               |
| avatarSize             | Size of avatar circle                               | number    |      60       |
| showAvatarText         | For show or hide avatar text.                       | bool      |     true      |
| avatarTextStyle        | For avatar text style                               | TextStyle |               |

## Usage

```javascript
const data = [
	{
		user_id: 1,
		user_image:
			"https://pbs.twimg.com/profile_images/1222140802475773952/61OmyINj.jpg",
		user_name: "Ahmet Çağlar Durmuş",
		stories: [
			{
				story_id: 1,
				story_image:
					"https://image.freepik.com/free-vector/universe-mobile-wallpaper-with-planets_79603-600.jpg",
				swipeText: "Custom swipe text for this story",
				onPress: () => console.log("story 1 swiped"),
			},
			{
				story_id: 2,
				story_image:
					"https://image.freepik.com/free-vector/mobile-wallpaper-with-fluid-shapes_79603-601.jpg",
			},
		],
	},
	{
		user_id: 2,
		user_image:
			"https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
		user_name: "Test User",
		stories: [
			{
				story_id: 1,
				story_image:
					"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjORKvjcbMRGYPR3QIs3MofoWkD4wHzRd_eg&usqp=CAU",
				swipeText: "Custom swipe text for this story",
				onPress: () => console.log("story 1 swiped"),
			},
			{
				story_id: 2,
				story_image:
					"https://files.oyebesmartest.com/uploads/preview/vivo-u20-mobile-wallpaper-full-hd-(1)qm6qyz9v60.jpg",
				swipeText: "Custom swipe text for this story",
				onPress: () => console.log("story 2 swiped"),
			},
		],
	},
];

<Story
	data={data}
	duration={10}
	avatarTextStyle={{
		fontSize: 20,
	}}
	onStart={(item) => console.log(item)}
	onClose={(item) => console.log("close: ", item)}
	onCartPress={(item) => console.log("cart: ", item)}
	onLikePress={(item) => console.log("like: ", item)}
	onSharePress={(item) => console.log("share: ", item)}
	customSwipeUpComponent={
		<View>
			<Text>Swipe</Text>
		</View>
	}
	style={{ marginTop: 30 }}
/>;
```

### this project inspired by [react-native-insta-story](https://github.com/caglardurmus/react-native-insta-story) repository
