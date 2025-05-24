import { UrlPresetNode, ChainNode, PresetChain, ChainResult, urlPreset } from './chainTypes'

export class PresetUrlBuilder {
  private pathStack: (string | number)[] = []
  private paramMap: Record<string, string | number> = {}

  constructor(private preset: UrlPresetNode = urlPreset) {}

  private createChain<T extends UrlPresetNode>(node: T, currentPath: string[] = []): ChainNode<T> {
    const chain = {} as ChainNode<T>

    // build 메서드 구현
    Object.defineProperty(chain, 'build', {
      value: (): ChainResult => {
        const path = this.pathStack.join('/')
        return {
          path: `/${path}`,
          params: { ...this.paramMap }
        }
      },
      enumerable: true
    })

    // 각 노드에 대한 체인 메서드 생성
    for (const key in node) {
      const value = node[key]
      
      if (typeof value === 'string') {
        // 파라미터 노드 (:userId 등)
        Object.defineProperty(chain, key, {
          value: (param?: string | number) => {
            if (param !== undefined) {
              this.pathStack.push(key, param)
              this.paramMap[value.replace(':', '')] = param
            } else {
              this.pathStack.push(key)
            }
            return chain
          },
          enumerable: true
        })
      } else if (value === null) {
        // 종단 노드
        Object.defineProperty(chain, key, {
          value: (param?: string | number) => {
            this.pathStack.push(key)
            return chain
          },
          enumerable: true
        })
      } else {
        // 중첩 객체 노드
        Object.defineProperty(chain, key, {
          value: (param?: string | number) => {
            if (param !== undefined) {
              this.pathStack.push(key, param)
            } else {
              this.pathStack.push(key)
            }
            return this.createChain(value as UrlPresetNode, [...currentPath, key])
          },
          enumerable: true
        })
      }
    }

    return chain
  }

  // 체인 생성 시작
  chain(): ChainNode<typeof this.preset> {
    this.pathStack = []
    this.paramMap = {}
    return this.createChain(this.preset)
  }

  // 빌더 초기화
  reset(): this {
    this.pathStack = []
    this.paramMap = {}
    return this
  }
}

// 사용 예시:
// const builder = new PresetUrlBuilder()
// const result = builder.chain()
//   .user()
//   .byId(1)
//   .posts()
//   .byId(2)
//   .comments()
//   .build() 