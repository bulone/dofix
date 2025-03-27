---
title: Index
subtitle: Fixit主题的美化记录
date: 2025-03-15T23:59:34+08:00
slug: 52ddf53
draft: true
author:
  name:
  link:
  email:
  avatar:
description: Fixit主题的美化记录奥斯陆冬季法律；快速减肥拉开积分；拉萨会计法律是肯定积分；拉开积分埃里克森的军阀势力的咖啡机阿斯兰的看法记录；卡萨丁浪费
keywords:
license:
weight: 1
tags:
  - draft
categories:
  - draft
hiddenFromHomePage: false
hiddenFromSearch: false
hiddenFromRelated: false
hiddenFromFeed: false
summary:
resources:
  - name: featured-image
    src: cover.jpg
  - name: featured-image-preview
    src: featured-image-preview.jpg
toc: true
math: false
lightgallery: false
password:
message:

# See details front matter: https://fixit.lruihao.cn/documentation/content-management/introduction/#front-matter
---

<!--more-->

为了熟练数据训练的过程，我在闲暇之余搞了一组当代顶流蔡徐坤先生的数据集，这个数据集包含了蔡徐坤先生的照片和一些鸡的照片，为什么要这么做？自然是现在的网友分不清蔡徐坤先生和鸡！于是我用这些数据集训练了一个模型并开发了一个坤坤鉴定器，以此来帮助网友分辩出坤坤先生。

效果展示
这必须放个效果图：

![你好](cover.jpg "你好")

参数解释：

KUN：含坤量，可以看出左图含坤量极高，鉴定为坤坤。
CHICKEN：含鸡量，右图含鸡量高，鉴定为只因。
代码还有音乐播放功能，当为坤坤时随机播放“厉不厉害你坤哥”，“哎呦你干嘛”，当为只因时播放“只因你太美”
代码示例
数据集和训练的模型等我整理以后放到网盘进行共享，下面提供代码。

python
import cv2
import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image, ImageDraw, ImageFont
import numpy as np
import os
import pygame
import random

# 初始化pygame用于播放音乐
pygame.init()

# 加载预训练模型
device = "cuda" if torch.cuda.is_available() else "cpu"
model = models.resnet18(pretrained=True)
nr_filters = model.fc.in_features
model.fc = nn.Linear(nr_filters, 1)
model.load_state_dict(torch.load('kun_weight.pt', map_location=torch.device(device)))
model = model.to(device)
model.eval()

# 图像预处理
transformations = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# 读取文件夹中的图片
def load_images_from_folder(folder):
    images = []
    for filename in os.listdir(folder):
        img = cv2.imread(os.path.join(folder, filename))
        if img is not None:
            img = cv2.resize(img, (600, 600))  # 统一尺寸为600x600
            images.append(img)
    return images

folder = '/use/'  # 替换为你的图片文件夹路径
images = load_images_from_folder(folder)
index = 0

# 播放音乐函数
def play_sound(file_path):
    pygame.mixer.music.load(file_path)
    pygame.mixer.music.play()

# 加载声音文件
chicken_sound_path = '/Users/jini.mp3'
kun_sound_paths = [
    '/Users/kunkun.mp3',  # 坤坤第一段音乐
    '/Users/kunkun2.mp3'   # 坤坤第二段音乐
]

# 创建窗口并设置固定大小
cv2.namedWindow('KUN-er Classifier', cv2.WINDOW_NORMAL)
cv2.resizeWindow('KUN-er Classifier', 1000, 800)  # 固定窗口大小

# 加载字体
font_path = '/System/Library/Fonts/STHeiti Light.ttc'  # 替换为你的字体文件路径
font = ImageFont.truetype(font_path, 20)
font_large = ImageFont.truetype(font_path, 24)

# 主循环
while True:
    frame = images[index]

    # 将OpenCV图像转换为PIL图像
    pil_image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

    # 图像预处理
    img_tensor = transformations(pil_image).unsqueeze(0).to(device)

    # 模型推理
    with torch.no_grad():
        pred = model(img_tensor)
        sigmoid = torch.sigmoid(pred)
        probability = sigmoid.item()

    # 确定分类结果
    kun_prob = round(100 * (1 - probability), 2)
    chicken_prob = round(100 * probability, 2)
    label = f"KUN: {kun_prob}% | CHICKEN: {chicken_prob}%"

    # 根据识别结果播放音乐和显示鉴定结果
    if chicken_prob > 50:
        play_sound(chicken_sound_path)  # 鸡声音文件路径
        label += " | 鉴定为只因"
    elif kun_prob > 50:
        kun_sound_path = random.choice(kun_sound_paths)  # 随机选择一段坤坤的音乐
        play_sound(kun_sound_path)  # 坤声音文件路径
        label += " | 鉴定为坤坤"

    # 在PIL图像上绘制标签
    draw = ImageDraw.Draw(pil_image)
    draw.rectangle((10, 10, 550, 60), fill=(255, 0, 0, 128))  # 添加背景框
    draw.text((20, 25), label, font=font_large, fill=(255, 255, 255, 0))

    # 添加操作信息
    operation_info = "按A上一张照片，按D下一张照片——坤鸡鉴定器"
    draw.rectangle((10, 560, 455, 590), fill=(0, 0, 0, 128))  # 添加背景框
    draw.text((20, 565), operation_info, font=font, fill=(255, 255, 255, 0))

    # 将PIL图像转换回OpenCV图像
    frame = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)

    # 显示结果
    cv2.imshow('KUN-er Classifier', frame)

    # 按下'a'键上一张，'d'键下一张，'q'键退出循环
    key = cv2.waitKey(0)
    if key == ord('a'):  # 左键
        index = (index - 1) % len(images)
    elif key == ord('d'):  # 右键
        index = (index + 1) % len(images)
    elif key == ord('q'):  # 按下'q'键退出循环
        break

# 关闭所有OpenCV窗口
cv2.destroyAllWindows()
代码还是很简单的，不过本项目还是以娱乐为主，切莫当真，坤哥的人品和实力还是很不错的😄。

最后
不得不吐槽一下横琴口岸那边的快递站真的混乱，拿快递好麻烦，打算开发一个找快递的程序，直接自己找到取件码。

等我好消息。