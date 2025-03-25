---
title: Index
subtitle:
date: 2025-03-15T17:57:16+08:00
slug: 6f5e4cf
draft: true
author:
  name:
  link:
  email:
  avatar:
description: 二度美化Fixit，赏心悦目些。
keywords:
license:
comment: false
weight: 0
tags:
  - draft
categories:
  - draft
  - text
collections: test
hiddenFromHomePage: false
hiddenFromSearch: false
hiddenFromRelated: false
hiddenFromFeed: false
summary:
resources:
  - name: featured-image
    src: cover.jpg
  - name: featured-image-preview
    src: cover.jpg
toc: true
math: false
lightgallery: false
password:
message:

# See details front matter: https://fixit.lruihao.cn/documentation/content-management/introduction/#front-matter
---

<!--more-->




😁Fixit 是一款简约而不失功能的 Hugo 主题，并且给予了相对自由的自定义化程度，可以在其基础上自行修改相关页面、CSS 样式。因为我的前端语言有限，因此部分样式是借鉴其他博客站或 GPT 生成代码后之修改。  

{{< link "https://github.com/hugo-fixit/FixIt" "FixIt Theme" "source of FixIt Theme" true >}}

网站主体风格借鉴 [Blog - atpX](https://atpx.com/blog/)，🙇感谢。  
颜色来自 [Customizing Colors - Tailwind CSS](https://v3.tailwindcss.com/docs/customizing-colors)，🤩好看。
## 整体页面框架
- 说明：该页面主要是网站整体样式框架  
- 位置：`layouts\_default\baseof.html`
- 修改：将第 26 行内容更换如下，`header` 栏只在除文章页显示。
```
{{ if ne .Kind "page" }} {{- partial "header.html" . -}} {{ end }}
```
## 主页风格
- 说明：文章排列风格改为双列；预览图比例改为 `1000 / 5000`
- 位置：`layouts\_default\home.html & summary.html`
1. `home.tml`，该页面是主页中间块，修改内容仅是用 `div` 块将文章列表包裹进行后续修改。
```html
<div class="post-article">
      {{- /* Posts */ -}}
      {{- if ne $posts.enable false | and .Site.RegularPages -}}
        {{- /* Paginate */ -}}
        {{- $pages := .Scratch.Get "mainSectionPages" -}}
        {{- if .Site.Params.page.hiddenFromHomePage -}}
          {{- $pages = where $pages "Params.hiddenfromhomepage" false -}}
        {{- else -}}
          {{- $pages = where $pages "Params.hiddenfromhomepage" "!=" true -}}
        {{- end -}}
        {{- with $posts.paginate | default .Site.Params.paginate -}}
          {{- $pages = $.Paginate $pages . -}}
        {{- else -}}
          {{- $pages = .Paginate $pages -}}
        {{- end -}}
        {{- range $pages.Pages -}}
          {{- .Render "summary" -}}
        {{- end -}}
        {{- partial "paginator.html" . -}}
      {{- end -}}
    </div>
```
2. summary.html  
   说明：该页面改动地方较多，主要是因为修改排列方式以内部分布局，所以要重新编排
```html
{{- $params := .Params | merge .Site.Params.page -}}

<article class="single summary" itemscope itemtype="http://schema.org/Article">
  {{- /* Featured image */ -}}
  {{- $image := $params.featuredimagepreview | default $params.featuredimage -}}
  {{- with dict "Path" $image "Resources" .Resources | partial "function/resource.html" }}
    {{- $image = .RelPermalink }}
  {{- end }}
  {{- with .Resources.GetMatch "featured-image" -}}
    {{- $image = .RelPermalink -}}
  {{- end -}}
  {{- with .Resources.GetMatch "featured-image-preview" -}}
    {{- $image = .RelPermalink -}}
  {{- end -}}
  {{- with $image -}}
    <div class="featured-image-preview">
      <a href="{{ $.RelPermalink }}" aria-label="{{ $.Title }}">
        {{- $optim := slice 
          (dict "Process" "fill 800x240 Center webp q75" "descriptor" "800w")
          (dict "Process" "fill 1200x360 Center webp q75" "descriptor" "1200w")
          (dict "Process" "fill 1600x480 Center webp q75" "descriptor" "1600w") 
        -}}
        {{- dict "Src" . "Title" $.Title "Resources" $.Resources "Loading" "eager" "Width" "800" "Height" "240" "Sizes" "(max-width: 680px) 100vw, (max-width: 960px) 80vw, (max-width: 1440px) 56vw, 800px" "OptimConfig" $optim "Alt" (printf "Featured image for %v" $.Title) | partial "plugin/image.html" -}}
      </a>
    </div>
  {{- end -}}

  

  <div class="post-detail">
    <!-- ------------- 收录 -------------- -->
    <div class="post-included-info">
      {{- partial "single/post-included-in.html" . -}}
    </div>
    {{- /* Title */ -}}
    <a href="{{ .RelPermalink }}">
      <h2 class="single-title" itemprop="name headline">
        {{ cond (.Param "capitalizeTitles") (title .Title) .Title }}
      </h2>
    </a>

    {{- /* Meta */ -}}
    <!-- <div class="post-meta">
      {{- partial "single/post-author.html" . -}}

      {{- with .PublishDate | dateFormat (.Site.Params.dateFormat | default "2006-01-02") -}}
        &nbsp;<span class="post-publish" title='{{ "2006-01-02 15:04:05" | $.PublishDate.Format }}'>
          {{- printf `<time datetime="%v">%v</time>` . . | dict "Date" | T "single.publishedOnDate" | safeHTML -}}
        </span>
      {{- end -}}

      {{- partial "single/post-included-in.html" . -}}
    </div> -->

    {{- /* Summary content */ -}}
    <div class="content">
      {{- if .Summary -}}
        {{- $plainify := (.Param "summaryPlainify") | default false -}}
        {{- with .Markup "home" -}}
          {{- with .Render -}}
            {{- $summary := dict "Content" .Summary.Text "Ruby" $params.ruby "Fraction" $params.fraction "Fontawesome" $params.fontawesome | partial "function/content.html" | safeHTML -}}
            {{- cond $plainify ($summary | plainify) $summary -}}
          {{- end -}}
        {{- end -}}
      {{- else -}}
        {{- .Description | safeHTML -}}
      {{- end -}}
    </div>

    {{- /* Footer */ -}}
    <div class="post-footer">
      <!-- <a href="{{ .RelPermalink }}">{{ T "single.readMore" }}</a> -->
      <!-- {{- $tagTerms := .GetTerms "tags" -}}
      {{- if $tagTerms -}}
        <div class="post-tags">
          {{- dict "Class" "fa-solid fa-tags fa-fw me-1" | partial "plugin/icon.html" -}}
          {{- range $tagTerms -}}
            <a href='{{ partial "function/escapeurl.html" .RelPermalink }}' class="post-tag">{{ .LinkTitle }}</a>
          {{- end -}}
        </div>
      {{- end -}} -->
      
      <!-- ------------ 发布日期 ------------- -->
      {{- with .PublishDate | dateFormat (.Site.Params.dateFormat | default "2006-01-02") -}}
        <span class="post-publish" title='{{ "2006-01-02 15:04:05" | $.PublishDate.Format }}'>
          {{- printf `<time datetime="%v">%v</time>` . . | safeHTML -}}
        </span>
      {{- end -}}
       <!-- ---------- 判断转发/置顶 ----------- -->
      <div class="post-sign">
        {{- with $params.weight -}}
            {{- $icon := dict "Class" "fa-solid fa-thumbtack fa-fw" -}}
            <span title="{{ T "single.pin" }}" class="icon-pin">{{- $icon | partial "plugin/icon.html" -}}</span>
        {{- end -}}
        {{- $repost := $params.repost | default dict -}}
        {{- with $repost -}}
          {{- if eq .Enable true -}}
            {{- $icon := dict "Class" "fa-solid fa-retweet fa-fw" -}}
            {{- $title := cond (hasPrefix .Url "http") (printf "%v -> %v" (T "single.repost") .Url ) (T "single.repost") -}}
            <span title="{{ $title }}" class="icon-repost">{{- $icon | partial "plugin/icon.html" -}}</span>
          {{- end -}}
        {{- end -}}
      </div>
    </div>
  </div>
</article>
{{- /* EOF */ -}}
```
3. post-included-in.html  
   说明：修改显示方式，直接输出分类名
```html
{{- $categories := slice -}}
{{- range .GetTerms "categories" -}}
  {{- $categories = $categories | append (
    printf `<a href="%v" class="post-category" title="%v">%v</a>`
    (partial "function/escapeurl.html" .RelPermalink)
    (printf "%v - %v" (T "category") .LinkTitle)
    .LinkTitle
  ) -}}
{{- end -}}
{{- $categoriesStr := delimit $categories "&nbsp;,&nbsp" -}}

{{- $collections := slice -}}
{{- range .GetTerms "collections" -}}
  {{- $collections = $collections | append (
    printf `<a href="%v" class="post-collection" title="%v">%v</a>`
    (partial "function/escapeurl.html" .RelPermalink)
    (printf "%v - %v" (T "collection") .LinkTitle)
    .LinkTitle
  ) -}}
{{- end -}}
{{- $collectionStr := delimit $collections "&nbsp;,&nbsp" -}}

{{- if .Params.categories | or .Params.collections -}}
  <span class="post-included-in">
    {{- if not .Params.collections -}}
      {{- $categoriesStr | safeHTML -}}
    {{- else if not .Params.categories -}}
      {{- $collectionStr | safeHTML -}}
    {{- else -}}
      {{- print $categoriesStr "｜" $collectionStr | safeHTML -}}
    {{- end -}}
  </span>
{{- end -}}

```

## 文章页面
移动端 toc 风格  
https://voxsay.com/posts/how-to-build-google-custom-search-engine-step-by-step/

## 自定义 CSS
位置：`assets\_custom.scss`  
下载地址：