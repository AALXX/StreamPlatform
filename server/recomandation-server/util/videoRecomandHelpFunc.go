package videoRecomandationHelper

func MostFrequentNumber(arr []int) int {
    numCount := make(map[int]int)
    mostFrequentNum := 0
    maxCount := 0

    for _, num := range arr {
        numCount[num]++
        if numCount[num] > maxCount {
            mostFrequentNum = num
            maxCount = numCount[num]
        }
    }

    return mostFrequentNum
}
