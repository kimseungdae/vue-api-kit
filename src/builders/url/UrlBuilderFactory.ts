import { UrlBuilder } from './UrlBuilder'
import { UrlPresetConfig } from './types'

export class UrlBuilderFactory {
  private static instance: UrlBuilderFactory
  private presets: Map<string, UrlPresetConfig> = new Map()

  private constructor() {}

  // 싱글톤 인스턴스 얻기
  static getInstance(): UrlBuilderFactory {
    if (!UrlBuilderFactory.instance) {
      UrlBuilderFactory.instance = new UrlBuilderFactory()
    }
    return UrlBuilderFactory.instance
  }

  // 프리셋 등록
  registerPreset(name: string, config: UrlPresetConfig): void {
    this.presets.set(name, config)
  }

  // 여러 프리셋 등록
  registerPresets(presets: Record<string, UrlPresetConfig>): void {
    Object.entries(presets).forEach(([name, config]) => {
      this.registerPreset(name, config)
    })
  }

  // 프리셋 가져오기
  getPreset(name: string): UrlPresetConfig | undefined {
    return this.presets.get(name)
  }

  // 프리셋으로 URL 빌더 생성
  create(presetName: string): UrlBuilder {
    const preset = this.presets.get(presetName)
    if (!preset) {
      throw new Error(`Preset "${presetName}" not found`)
    }
    return new UrlBuilder(preset)
  }

  // 커스텀 설정으로 URL 빌더 생성
  createWithConfig(config: UrlPresetConfig): UrlBuilder {
    return new UrlBuilder(config)
  }

  // 프리셋 삭제
  removePreset(name: string): boolean {
    return this.presets.delete(name)
  }

  // 모든 프리셋 삭제
  clearPresets(): void {
    this.presets.clear()
  }

  // 등록된 모든 프리셋 이름 가져오기
  getPresetNames(): string[] {
    return Array.from(this.presets.keys())
  }
} 