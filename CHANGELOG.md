---
title: Change Log
---

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](http://semver.org).

## 0.10.0

### Fixed

- field `value` type

## 0.9.0

### Changed

- `form.$state` & `field.$state` ==> `form.$` & `field.$`

### Added

- normalize `field.$` (error, initial, length, submitError, value are equals null)

## 0.8.0

### Changed

- `createForm` returns api and _$state_ (not _$formState_)

## 0.7.0

### Fixed

- field always contains name

## 0.6.0

### Added

- `registerField` returns Store and api

### Changed

- form and field api

### Removed

- api.initialize
- $registeredFields
- $fields

## 0.4.0

### Removed

- rollback 0.3.0 :c

## 0.3.0

### Fixed

- `validate` types 

## 0.2.0

### Added

- ability to pass `Store` as `initialValues`

## 0.1.0

### Added

- base bindings
